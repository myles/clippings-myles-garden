import "dotenv/config";

const loadConfig = (): Record<string, string> => {
  const {
    CLIPPINGS_SITE_URL = "https://clippings.myles.garden",
    CLIPPINGS_ARENA_API_KEY,
    CLIPPINGS_ARENA_CHANNEL_ID,
  } = process.env;

  if (!CLIPPINGS_ARENA_API_KEY) {
    throw new Error("Set the CLIPPINGS_ARENA_API_KEY environment variable.");
  }
  if (!CLIPPINGS_ARENA_CHANNEL_ID) {
    throw new Error("Set the CLIPPINGS_ARENA_CHANNEL_ID environment variable.");
  }

  return {
    SITE_URL: CLIPPINGS_SITE_URL,
    ARENA_API_KEY: CLIPPINGS_ARENA_API_KEY,
    ARENA_CHANNEL_ID: CLIPPINGS_ARENA_CHANNEL_ID,
  };
};

export default loadConfig();
