import type { LiveLoader } from "astro/loaders";
import { fetchArenaJson } from "./arena-client";
import type { ArenaChannel } from "./channel-loader.types";

type EntryFilter = {
  id: string;
};

type CollectionFilter = {};

export function channelLoader(config: {
  apiKey?: string;
}): LiveLoader<ArenaChannel, EntryFilter, CollectionFilter> {
  return {
    name: "arena-channel-loader",
    loadCollection: async () => {
      console.warn(
        "Loading the entire Arena Channels is not support right now, because I can not figure out how to get a list of all the channels assoitated with a user.",
      );
      return { entries: [] };
    },
    loadEntry: async ({ filter }) => {
      const { id: channelId } = filter;

      try {
        const data = await fetchArenaJson<ArenaChannel>(
          `https://api.are.na/v3/channels/${channelId}`,
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
          error: new Error("Failed to load the Arena Channel.", {
            cause: error,
          }),
        };
      }
    },
  };
}
