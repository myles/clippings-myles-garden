import type { LiveDataEntry } from "astro";
import type { BlockBase, BlockType } from "./schemas/block-schema.types";

const createIsBlockType = <T extends BlockType>(type: T) => {
  return (block: LiveDataEntry): block is BlockBase<T> =>
    block.data.type === type;
};

export const isAttachmentBlock = createIsBlockType("Attachment");
export const isChannelBlock = createIsBlockType("Channel");
export const isEmbedBlock = createIsBlockType("Embed");
export const isImageBlock = createIsBlockType("Image");
export const isLinkBlock = createIsBlockType("Link");
export const isTextBlock = createIsBlockType("Text");
