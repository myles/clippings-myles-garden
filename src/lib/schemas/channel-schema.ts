import { z } from "astro/zod";
import { parseISO } from "date-fns";
import { markdownContentSchema } from "./base-schema";

export const channelSchema = z.object({
  type: z.literal("Channel"),
  slug: z.string(),
  title: z.string(),
  description: markdownContentSchema,
  state: z.enum(["available", "deleted"]),
  visibility: z.enum(["public", "private", "closed"]),
  created_at: z.string().transform((value) => parseISO(value)),
  updated_at: z.string().transform((value) => parseISO(value)),
});
