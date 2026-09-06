import type { Channel } from "@aredotna/sdk";
import type { LiveLoader } from "astro/loaders";
import { createArenaClient } from "./arena-client";

type EntryFilter = {
  id: string;
};

type CollectionFilter = {};

export function channelLoader(config: {
  apiKey?: string;
}): LiveLoader<Channel, EntryFilter, CollectionFilter> {
  const arena = createArenaClient({ apiKey: config?.apiKey });

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
        const data = await arena.getChannel(channelId);
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
