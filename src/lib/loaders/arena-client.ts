import { createArena, type Block, type Channel } from "@aredotna/sdk";
import type { ArenaClient, ArenaClientOptions } from "./arena-client.types";

const DEFAULT_MAX_RETRIES = 4;

const requestCache = new Map<string, Promise<unknown>>();

/**
 * Are.na SDK wrapper adding build-scoped caching, so the same channel or
 * block is only fetched once per build no matter how many pages ask for it.
 */
export function createArenaClient({
  apiKey,
  maxRetries = DEFAULT_MAX_RETRIES,
}: ArenaClientOptions): ArenaClient {
  const arena = createArena({
    token: apiKey,
    retry: { respectRateLimits: true, maxRetries },
  });

  return {
    getChannel: (channelId) => {
      return cached(`channel:${channelId}`, () =>
        arena.channels.get(channelId),
      );
    },

    getBlock: (blockId) => {
      return cached(`block:${blockId}`, () => arena.blocks.get(blockId));
    },

    getChannelContents: (channelId, per) => {
      return cached(`contents:${channelId}:${per}`, async () => {
        const contents: (Block | Channel)[] = [];
        const pages = arena.channels.paginateContents(channelId, { per });

        for await (const page of pages) {
          contents.push(...page.data);
        }

        return contents;
      });
    },
  };
}

function cached<T>(key: string, request: () => Promise<T>): Promise<T> {
  const hit = requestCache.get(key);
  if (hit) {
    return hit as Promise<T>;
  }

  const pending = request();
  requestCache.set(key, pending);
  // Don't cache failures: evict so a later caller starts fresh.
  pending.catch(() => requestCache.delete(key));

  return pending;
}
