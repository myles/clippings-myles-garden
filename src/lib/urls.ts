export default {
  block: {
    detail: (blockId: string | number) => `/${blockId}`,
  },
  external: {
    block: (blockId: string | number) => `https://www.are.na/block/${blockId}`,
  },
};
