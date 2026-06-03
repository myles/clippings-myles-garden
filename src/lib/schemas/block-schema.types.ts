import type { LiveDataEntry } from "astro";
import type { z } from "astro/zod";
import { blockSchema, imageSchema } from "./block-schema";

type BlockData = z.infer<typeof blockSchema>;
export type BlockType = BlockData["type"];

export type BlockBase<T extends BlockType> = LiveDataEntry<
  Extract<BlockData, { type: T }>
>;

export type Block = BlockBase<BlockType>;

export type ImageSchema = z.infer<typeof imageSchema>;
