import { defineLiveCollection } from "astro:content";

import config from "@/config";
import { createStorageClient } from "@/lib/bunny/storage-client";
import { blockLoader, channelLoader } from "@/lib/loaders";
import { blockSchema, channelSchema } from "@/lib/schemas";

const channels = defineLiveCollection({
  loader: channelLoader({ apiKey: config.ARENA_API_KEY }),
  schema: channelSchema,
});

const media = config.BUNNY && {
  storage: createStorageClient({
    zoneName: config.BUNNY.STORAGE_ZONE,
    accessKey: config.BUNNY.STORAGE_ACCESS_KEY,
    region: config.BUNNY.STORAGE_REGION,
  }),
  publicUrl: config.BUNNY.PULL_ZONE_URL,
};

const blocks = defineLiveCollection({
  loader: blockLoader({ apiKey: config.ARENA_API_KEY, media }),
  schema: blockSchema,
});

export const collections = { channels, blocks };
