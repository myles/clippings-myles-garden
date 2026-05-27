import type { LiveLoader } from "astro/loaders";
import type { ArenaBlock } from "./block-loader.types";

type EntryFilter = {
  id: string;
};

type CollectionFilter = {
  channelId: string;
};

export function blockLoader(config: {
  apiKey?: string;
}): LiveLoader<ArenaBlock, EntryFilter, CollectionFilter> {
  return {
    name: "arena-block-loader",
    loadCollection: async ({ filter }) => {
      const { channelId } = filter ?? {};
      const url = `https://api.are.na/v3/channels/${channelId}/contents`;

      try {
        const response = await fetch(url, {
          headers: [["Authorization", `Bearer ${config?.apiKey}`]],
        });
        const result = await response.json();
        console.log({ block: result.data[0] });
        return {
          entries: result.data.map((block: ArenaBlock) => ({
            id: block.id,
            data: block,
            rendered: {
              html:
                "content" in block
                  ? block.content.html
                  : block.description?.html,
            },
          })),
        };
      } catch (error) {
        return {
          error: new Error("Failed to load the Arena blocks."),
        };
      }
    },
    loadEntry: async ({ filter }) => {
      const { id: blockId } = filter;

      try {
        const response = await fetch(
          `https://api.are.na/v3/blocks/${blockId}`,
          { headers: [["Authorization", `Bearer ${config?.apiKey}`]] },
        );
        const data = await response.json();
        return {
          id: data.id,
          data: data,
          rendered: {
            html: data.description?.html,
          },
        };
      } catch (error) {
        return {
          error: new Error("Failed to load the Arena block."),
        };
      }
    },
  };
}
