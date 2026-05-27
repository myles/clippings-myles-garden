import "dotenv/config";

export default {
  ARENA_API_KEY: process.env.CLIPPINGS_ARENA_API_KEY ?? "",
  ARENA_CHANNEL_ID: process.env.CLIPPINGS_ARENA_CHANNEL_ID!,
};
