import "dotenv/config"; // oxlint-disable-line import/no-unassigned-import

type Config = {
  SITE_URL: string;
  ARENA_API_KEY: string;
  ARENA_MAIN_CHANNEL_ID: string;
  ARENA_OTHER_CHANNEL_IDS: string[];
  SITE_TINYLYTICS_ID?: string;
  PAGE_SIZE: number;
  BUNNY?: BunnyConfig;
};

type BunnyConfig = {
  STORAGE_ZONE: string;
  STORAGE_ACCESS_KEY: string;
  STORAGE_REGION: string;
  PULL_ZONE_URL: string;
};

// Falkenstein, Bunny's default storage region.
const DEFAULT_BUNNY_STORAGE_REGION = "de";

const loadConfig = (): Config => {
  const {
    CLIPPINGS_SITE_URL = "https://clippings.myles.garden",
    CLIPPINGS_ARENA_API_KEY,
    CLIPPINGS_ARENA_MAIN_CHANNEL_ID,
    CLIPPINGS_ARENA_OTHER_CHANNEL_IDS,
    CLIPPINGS_SITE_TINYLYTICS_ID,
    CLIPPINGS_PAGE_SIZE,
    CLIPPINGS_BUNNY_STORAGE_ZONE,
    CLIPPINGS_BUNNY_STORAGE_ACCESS_KEY,
    CLIPPINGS_BUNNY_STORAGE_REGION,
    CLIPPINGS_BUNNY_PULL_ZONE_URL,
  } = process.env;

  if (!CLIPPINGS_ARENA_API_KEY) {
    throw new Error("Set the CLIPPINGS_ARENA_API_KEY environment variable.");
  }
  if (!CLIPPINGS_ARENA_MAIN_CHANNEL_ID) {
    throw new Error(
      "Set the CLIPPINGS_ARENA_MAIN_CHANNEL_ID environment variable.",
    );
  }

  // Mirroring is all-or-nothing: half a Bunny config is a mistake, not a
  // request to skip it.
  const bunnyValues = [
    CLIPPINGS_BUNNY_STORAGE_ZONE,
    CLIPPINGS_BUNNY_STORAGE_ACCESS_KEY,
    CLIPPINGS_BUNNY_PULL_ZONE_URL,
  ];
  const hasBunnyConfig = bunnyValues.every(Boolean);
  if (!hasBunnyConfig && bunnyValues.some(Boolean)) {
    throw new Error(
      "Set all of CLIPPINGS_BUNNY_STORAGE_ZONE, " +
        "CLIPPINGS_BUNNY_STORAGE_ACCESS_KEY and " +
        "CLIPPINGS_BUNNY_PULL_ZONE_URL, or none of them.",
    );
  }

  return {
    SITE_URL: CLIPPINGS_SITE_URL,
    ARENA_API_KEY: CLIPPINGS_ARENA_API_KEY,
    ARENA_MAIN_CHANNEL_ID: CLIPPINGS_ARENA_MAIN_CHANNEL_ID,
    ARENA_OTHER_CHANNEL_IDS: CLIPPINGS_ARENA_OTHER_CHANNEL_IDS
      ? CLIPPINGS_ARENA_OTHER_CHANNEL_IDS.split(",")
      : [],
    SITE_TINYLYTICS_ID: CLIPPINGS_SITE_TINYLYTICS_ID,
    PAGE_SIZE: CLIPPINGS_PAGE_SIZE ? parseInt(CLIPPINGS_PAGE_SIZE) : 12,
    BUNNY: hasBunnyConfig
      ? {
          STORAGE_ZONE: CLIPPINGS_BUNNY_STORAGE_ZONE!,
          STORAGE_ACCESS_KEY: CLIPPINGS_BUNNY_STORAGE_ACCESS_KEY!,
          STORAGE_REGION:
            CLIPPINGS_BUNNY_STORAGE_REGION || DEFAULT_BUNNY_STORAGE_REGION,
          PULL_ZONE_URL: CLIPPINGS_BUNNY_PULL_ZONE_URL!,
        }
      : undefined,
  };
};

export default loadConfig();
