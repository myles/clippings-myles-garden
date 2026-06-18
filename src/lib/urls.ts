export default {
  index: () => `/`,

  block: {
    detail: (blockId: string | number) => `/block/${blockId}`,
  },

  external: {
    user: (userId: string) => `https://www.are.na/${userId}`,
    block: (blockId: string | number) => `https://www.are.na/block/${blockId}`,
    channel: (channelId: string | number) =>
      `https://www.are.na/channel/${channelId}`,
  },
};
