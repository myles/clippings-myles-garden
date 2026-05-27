import "dotenv/config";

export default {
  CLIPPINGS_SITE:
    process.env.CLIPPINGS_SITE ?? "https://clippings.myles.garden",
  ARENA_API_KEY: process.env.CLIPPINGS_ARENA_API_KEY ?? "",
  ARENA_CHANNEL_ID: process.env.CLIPPINGS_ARENA_CHANNEL_ID!,
};
