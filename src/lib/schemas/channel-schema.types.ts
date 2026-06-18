import type { LiveDataEntry } from "astro";
import type { z } from "astro/zod";
import { channelSchema } from "./channel-schema";

type ChannelData = z.infer<typeof channelSchema>;

export type Channel = LiveDataEntry<ChannelData>;
