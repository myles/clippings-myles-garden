import type { LiveDataEntry } from "astro";
import type { BlockBase, BlockType } from "./schemas/block-schema.types";

const createIsBlockType = <T extends BlockType>(type: T) => {
  return (block: LiveDataEntry): block is BlockBase<T> =>
    block.data.type === type;
};

export const isImageBlock = createIsBlockType("Image");
