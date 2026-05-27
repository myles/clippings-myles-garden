import type { LiveDataEntry } from "astro";
import { blockSchema } from "./block-schema";
import type { z } from "astro/zod";

type BlockData = z.infer<typeof blockSchema>;
export type BlockType = BlockData["type"];

export type BlockBase<T extends BlockType> = LiveDataEntry<
  Extract<BlockData, { type: T }>
>;

export type Block = BlockBase<BlockType>;
