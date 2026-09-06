import type { Block, Channel } from "@aredotna/sdk";
import type { LiveLoader } from "astro/loaders";
import { createArenaClient } from "./arena-client";

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
}): LiveLoader<Connectable, EntryFilter, CollectionFilter> {
  const arena = createArenaClient({ apiKey: config?.apiKey });

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
        const results = await arena.getChannelContents(channelId, per);

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
        const data = await arena.getBlock(Number(blockId));
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
