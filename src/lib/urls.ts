export default {
  index: () => `/`,
  feed: (type: "json" | "rss" = "json") => `/channel/feed.${type}`,

  block: {
    detail: (blockId: string | number) => `/block/${blockId}`,
  },
  channel: {
    list: () => `/channels`,
    detail: (channelId: string) => `/channel/${channelId}`,
    feed: (channelId: string, type: "json" | "rss" = "json") =>
      `/channel/${channelId}/feed.${type}`,
  },

  external: {
    user: (userId: string) => `https://www.are.na/${userId}`,
    block: (blockId: string | number) => `https://www.are.na/block/${blockId}`,
    channel: (channelId: string | number) =>
      `https://www.are.na/channel/${channelId}`,
  },
};
