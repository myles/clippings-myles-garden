import { createArena, type Block, type Channel } from "@aredotna/sdk";

import type { ArenaClient, ArenaClientOptions } from "./arena-client.types";

import { cached } from "./cache";

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
      return cached(requestCache, `channel:${channelId}`, () =>
        arena.channels.get(channelId),
      );
    },

    getBlock: (blockId) => {
      return cached(requestCache, `block:${blockId}`, () =>
        arena.blocks.get(blockId),
      );
    },

    getChannelContents: (channelId, per) => {
      return cached(requestCache, `contents:${channelId}:${per}`, async () => {
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
