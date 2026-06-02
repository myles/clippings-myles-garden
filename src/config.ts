import "dotenv/config";

export default {
  SITE_URL: process.env.CLIPPINGS_SITE_URL ?? "https://clippings.myles.garden",
  ARENA_API_KEY: process.env.CLIPPINGS_ARENA_API_KEY ?? "",
  ARENA_CHANNEL_ID: process.env.CLIPPINGS_ARENA_CHANNEL_ID ?? "",
} as Record<string, string>;
