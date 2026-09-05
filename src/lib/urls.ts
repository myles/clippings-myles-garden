/**
 * The route each feed type is served from. RSS is served as `.xml`, so the
 * feed type cannot be used as the file extension directly.
 */
const FEED_EXTENSION = {
  json: "json",
  rss: "xml",
} as const;

type FeedType = keyof typeof FEED_EXTENSION;

export default {
  index: () => `/`,
  feed: (type: FeedType = "json") => `/feed.${FEED_EXTENSION[type]}`,

  block: {
    detail: (blockId: string | number) => `/block/${blockId}`,
  },
  channel: {
    list: () => `/channels`,
    detail: (channelId: string) => `/channel/${channelId}`,
    feed: (channelId: string, type: FeedType = "json") =>
      `/channel/${channelId}/feed.${FEED_EXTENSION[type]}`,
  },

  external: {
    user: (userId: string) => `https://www.are.na/${userId}`,
    block: (blockId: string | number) => `https://www.are.na/block/${blockId}`,
    channel: (channelId: string | number) =>
      `https://www.are.na/channel/${channelId}`,
  },
};
