import { defineLiveCollection } from "astro:content";
import config from "./config";
import { blockLoader } from "./lib/loaders/block-loader";
import { channelLoader } from "./lib/loaders/channel-loader";
import { blockSchema } from "./lib/schemas/block-schema";
import { channelSchema } from "./lib/schemas/channel-schema";

const channels = defineLiveCollection({
  loader: channelLoader({ apiKey: config.ARENA_API_KEY }),
  schema: channelSchema,
});

const blocks = defineLiveCollection({
  loader: blockLoader({ apiKey: config.ARENA_API_KEY }),
  schema: blockSchema,
});

export const collections = { channels, blocks };
