import { z } from "astro/zod";
import { parseISO, formatISO } from "date-fns";

export const timestampSchema = z.codec(z.string(), z.date(), {
  decode: (value) => parseISO(value),
  encode: (value) => formatISO(value),
});

export const markdownContentSchema = z.object({
  markdown: z.string(),
  html: z.string(),
  plain: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  type: z.enum(["User", "Group"]),
  name: z.string(),
  slug: z.string(),
  avatar: z.url().nullable(),
  initials: z.string(),
});

export const embeddedConnectionSchema = z.object({
  id: z.number(),
  position: z.number(),
  pinned: z.boolean(),
  metadata: z.json().nullable(),
});
