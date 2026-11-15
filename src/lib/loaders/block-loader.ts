import type { Block, Channel } from "@aredotna/sdk";
import type { LiveLoader } from "astro/loaders";

import type { MediaMirrorOptions } from "./media-mirror.types";

import { createArenaClient } from "./arena-client";
import { createMediaMirror } from "./media-mirror";

// Are.na channel contents mix blocks with nested channels.
type Connectable = Block | Channel;

const MAX_PER_PAGE = 100;

type EntryFilter = {
  id: string;
};

type CollectionFilter = {
  channelId: string;
  per?: number;
};

export function blockLoader(config: {
  apiKey?: string;
  media?: MediaMirrorOptions;
}): LiveLoader<Connectable, EntryFilter, CollectionFilter> {
  const arena = createArenaClient({ apiKey: config?.apiKey });
  const media = createMediaMirror(config?.media);

  return {
    name: "arena-block-loader",
    loadCollection: async ({ filter }) => {
      const { channelId, per = MAX_PER_PAGE } = filter ?? {};

      if (!channelId) {
        return {
          error: new Error("Failed to load the Arena blocks: no channelId."),
        };
      }

      try {
        const contents = await arena.getChannelContents(channelId, per);
        const results = await Promise.all(
          contents.map((block) => media.mirrorBlock(block)),
        );

        return {
          entries: results.map((block: Connectable) => {
            const html =
              "content" in block
                ? block.content?.html
                : block.description?.html;
            return {
              id: block.id.toString(),
              data: block,
              rendered: html ? { html } : undefined,
            };
          }),
        };
      } catch (error) {
        return {
          error: new Error("Failed to load the Arena blocks.", {
            cause: error,
          }),
        };
      }
    },
    loadEntry: async ({ filter }) => {
      const { id: blockId } = filter;

      try {
        const data = await media.mirrorBlock(
          await arena.getBlock(Number(blockId)),
        );
        const html = data.description?.html;
        return {
          id: data.id.toString(),
          data: data,
          rendered: html ? { html } : undefined,
        };
      } catch (error) {
        return {
          error: new Error("Failed to load the Arena block.", { cause: error }),
        };
      }
    },
  };
}
