import "dotenv/config";

type Config = {
  SITE_URL: string;
  ARENA_API_KEY: string;
  ARENA_MAIN_CHANNEL_ID: string;
  ARENA_OTHER_CHANNEL_IDS: string[];
  SITE_TINYLYTICS_ID?: string;
  PAGE_SIZE: number;
};

const loadConfig = (): Config => {
  const {
    CLIPPINGS_SITE_URL = "https://clippings.myles.garden",
    CLIPPINGS_ARENA_API_KEY,
    CLIPPINGS_ARENA_MAIN_CHANNEL_ID,
    CLIPPINGS_ARENA_OTHER_CHANNEL_IDS,
    CLIPPINGS_SITE_TINYLYTICS_ID,
    CLIPPINGS_PAGE_SIZE,
  } = process.env;

  if (!CLIPPINGS_ARENA_API_KEY) {
    throw new Error("Set the CLIPPINGS_ARENA_API_KEY environment variable.");
  }
  if (!CLIPPINGS_ARENA_MAIN_CHANNEL_ID) {
    throw new Error("Set the CLIPPINGS_ARENA_MAIN_CHANNEL_ID environment variable.");
  }

  return {
    SITE_URL: CLIPPINGS_SITE_URL,
    ARENA_API_KEY: CLIPPINGS_ARENA_API_KEY,
    ARENA_MAIN_CHANNEL_ID: CLIPPINGS_ARENA_MAIN_CHANNEL_ID,
    ARENA_OTHER_CHANNEL_IDS: CLIPPINGS_ARENA_OTHER_CHANNEL_IDS ? CLIPPINGS_ARENA_OTHER_CHANNEL_IDS.split(",") : [],
    SITE_TINYLYTICS_ID: CLIPPINGS_SITE_TINYLYTICS_ID,
    PAGE_SIZE: CLIPPINGS_PAGE_SIZE ? parseInt(CLIPPINGS_PAGE_SIZE) : 12,
  };
};

export default loadConfig();
