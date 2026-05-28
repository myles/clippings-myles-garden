export default {
  block: {
    detail: (blockId: string | number) => `/${blockId}`,
  },
  external: {
    user: (userId: string) => `https://www.are.na/${userId}`,
    block: (blockId: string | number) => `https://www.are.na/block/${blockId}`,
  },
};
