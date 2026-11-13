import { createHash } from "node:crypto";
import { extname } from "node:path";

import type { MediaMirror, MediaMirrorOptions } from "./media-mirror.types";

import { cached } from "./cache";

// Flat directory, so a single listing tells us everything already mirrored.
const MEDIA_DIRECTORY = "arena";
const KEY_HASH_CHARS = 16;
const MAX_CONCURRENT_UPLOADS = 4;

const mirrorCache = new Map<string, Promise<unknown>>();

/**
 * Copies Are.na media into Bunny Storage and swaps block URLs for the pull
 * zone's. Files are keyed by a hash of the source URL, so anything already
 * mirrored is reused and a replaced Are.na file (new URL) gets a new key.
 * Without options it passes blocks through untouched, for local dev.
 */
export function createMediaMirror(options?: MediaMirrorOptions): MediaMirror {
  if (!options) {
    return {
      mirrorUrl: async (sourceUrl) => sourceUrl,
      mirrorBlock: async (block) => block,
    };
  }

  const { storage } = options;
  const publicUrl = options.publicUrl.replace(/\/+$/, "");
  const withUploadSlot = createLimiter(MAX_CONCURRENT_UPLOADS);

  const listMirrored = () => {
    return cached(mirrorCache, "listing", () =>
      storage.listFileNames(MEDIA_DIRECTORY),
    );
  };

  const copyToStorage = async (sourceUrl: string, path: string) => {
    const response = await fetch(sourceUrl);
    if (!response.ok || !response.body) {
      throw new Error(`Fetching ${sourceUrl} failed: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? undefined;
    await storage.uploadFile(path, response.body, contentType);
  };

  const mirrorUrl = (sourceUrl: string) => {
    return cached(mirrorCache, `url:${sourceUrl}`, async () => {
      const key = createKey(sourceUrl);
      const path = `${MEDIA_DIRECTORY}/${key}`;

      try {
        const mirrored = await listMirrored();
        if (!mirrored.has(key)) {
          await withUploadSlot(() => copyToStorage(sourceUrl, path));
          mirrored.add(key);
          console.log(`Mirrored ${sourceUrl} to ${path}`);
        }

        return `${publicUrl}/${path}`;
      } catch (error) {
        // Fall back to Are.na rather than failing the whole build.
        console.warn(`Couldn't mirror ${sourceUrl}; using Are.na.`, error);
        return sourceUrl;
      }
    });
  };

  return {
    mirrorUrl,

    mirrorBlock: async (block) => {
      const copy = { ...block };

      if ("image" in copy && copy.image?.src) {
        copy.image = { ...copy.image, src: await mirrorUrl(copy.image.src) };
      }

      if ("attachment" in copy && copy.attachment?.url) {
        copy.attachment = {
          ...copy.attachment,
          url: await mirrorUrl(copy.attachment.url),
        };
      }

      return copy;
    },
  };
}

/**
 * e.g. https://d2w9…cloudfront.net/1/original_abc.jpg?1700000000
 *   → 3f9a0c…e1.jpg
 */
function createKey(sourceUrl: string): string {
  const hash = createHash("sha256").update(sourceUrl).digest("hex");
  const extension = extname(new URL(sourceUrl).pathname).toLowerCase();

  return `${hash.slice(0, KEY_HASH_CHARS)}${extension}`;
}

// Runs at most `limit` tasks at once. A finished task hands its slot
// straight to the next waiter, so the count never dips and overshoots.
function createLimiter(limit: number) {
  let active = 0;
  const waiting: (() => void)[] = [];

  return async <T>(task: () => Promise<T>): Promise<T> => {
    if (active >= limit) {
      await new Promise<void>((resolve) => waiting.push(resolve));
    } else {
      active++;
    }

    try {
      return await task();
    } finally {
      const next = waiting.shift();
      if (next) {
        next();
      } else {
        active--;
      }
    }
  };
}
