import type { LiveLoader } from "astro/loaders";
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
    loadCollection: async ({ filter }) => {
      console.warn(
        "Loading the entire Arena Channels is not support right now, because I can not figure out how to get a list of all the channels assoitated with a user.",
      );
      return { entries: [] };
    },
    loadEntry: async ({ filter }) => {
      const { id: channelId } = filter;

      try {
        const response = await fetch(
          `https://api.are.na/v3/channels/${channelId}`,
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
          error: new Error("Failed to load the Arena Channel."),
        };
      }
    },
  };
}
