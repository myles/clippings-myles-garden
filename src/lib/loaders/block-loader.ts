import type { LiveLoader } from "astro/loaders";
import { fetchArenaJson } from "./arena-client";
import type { ArenaBlock } from "./block-loader.types";
import type { ArenaListAPIResponse } from "./types";

type EntryFilter = {
  id: string;
};

type CollectionFilter = {
  channelId: string;
  per?: number;
};

export function blockLoader(config: {
  apiKey?: string;
}): LiveLoader<ArenaBlock, EntryFilter, CollectionFilter> {
  return {
    name: "arena-block-loader",
    loadCollection: async ({ filter }) => {
      const { channelId, per = 100 } = filter ?? {};
      const url = new URL(
        `/v3/channels/${channelId}/contents`,
        "https://api.are.na",
      );
      url.searchParams.set("per", per.toString());

      try {
        const results: ArenaBlock[] = [];

        let nextPageNum: number | null = 1;
        while (nextPageNum) {
          url.searchParams.set("page", nextPageNum.toString());

          const result = await fetchArenaJson<ArenaListAPIResponse<ArenaBlock>>(
            url,
            { apiKey: config?.apiKey },
          );
          results.push(...result.data);
          nextPageNum = result.meta.next_page;
        }

        return {
          entries: results.map((block: ArenaBlock) => {
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
        const data = await fetchArenaJson<ArenaBlock>(
          `https://api.are.na/v3/blocks/${blockId}`,
          { apiKey: config?.apiKey },
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
