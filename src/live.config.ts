import config from "@/config";
import { blockLoader, channelLoader } from "@/lib/loaders";
import { blockSchema, channelSchema } from "@/lib/schemas";
import { defineLiveCollection } from "astro:content";

const channels = defineLiveCollection({
  loader: channelLoader({ apiKey: config.ARENA_API_KEY }),
  schema: channelSchema,
});

const blocks = defineLiveCollection({
  loader: blockLoader({ apiKey: config.ARENA_API_KEY }),
  schema: blockSchema,
});

export const collections = { channels, blocks };
