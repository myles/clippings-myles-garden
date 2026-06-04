import type { LiveDataEntry } from "astro";
import { isBefore } from "date-fns";
import type { Block, BlockBase, BlockType } from "./schemas/block-schema.types";

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

export const sortBlocksByCreatedAt = (a: Block, b: Block): number =>
  isBefore(a.data.created_at, b.data.created_at) ? 1 : -1;
