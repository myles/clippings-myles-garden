import { z } from "astro/zod";
import {
  embeddedConnectionSchema,
  markdownContentSchema,
  timestampSchema,
  userSchema,
} from "./base-schema";
import { channelSchema } from "./channel-schema";

const sourceSchema = z.object({
  url: z.url(),
  title: z.string().nullable(),
  provider: z.object({
    name: z.string(),
    url: z.url(),
  }),
});

const abilitiesSchema = z.object({
  manage: z.boolean(),
  comment: z.boolean(),
  connect: z.boolean(),
});

const imageVersionSchema = z.object({
  src: z.string(),
  src_2x: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
});

export const imageSchema = z.object({
  alt_text: z.string().nullable(),
  blurhash: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  src: z.url(),
  aspect_ratio: z.number().nullable(),
  content_type: z.string(),
  filename: z.string(),
  file_size: z.number().nullable(),
  updated_at: timestampSchema,
  small: imageVersionSchema,
  medium: imageVersionSchema,
  large: imageVersionSchema,
  square: imageVersionSchema,
});

const attachmentSchema = z.object({
  filename: z.string().nullable(),
  content_type: z.string().nullable(),
  file_size: z.number().nullable(),
  file_extension: z.string().nullable(),
  updated_at: timestampSchema.nullable(),
  url: z.url(),
});

const embedSchema = z.object({
  url: z.url().nullable(),
  type: z.string().nullable(),
  title: z.string().nullable(),
  author_name: z.string().nullable(),
  author_url: z.url().nullable(),
  source_url: z.url().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  html: z.string().nullable(),
  thumbnail_url: z.url().nullable(),
});

const baseBlockSchema = z.object({
  id: z.number(),
  base_type: z.literal("Block"),
  title: z.string().nullable(),
  description: markdownContentSchema.nullable(),
  state: z.enum(["processing", "available", "failed"]),
  visibility: z.enum(["public", "private", "orphan"]),
  comment_count: z.number(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
  user: userSchema,
  source: sourceSchema.nullable(),
  metadata: z.json().nullable(),
  _links: z.json().nullable(),
  connection: embeddedConnectionSchema.nullable(),
  can: abilitiesSchema.optional(),
});

const attachmentBlockSchema = baseBlockSchema.extend({
  type: z.literal("Attachment"),
  attachment: attachmentSchema,
  image: imageSchema,
});

const embedBlockSchema = baseBlockSchema.extend({
  type: z.literal("Embed"),
  embed: embedSchema,
  image: imageSchema,
});

const imageBlockSchema = baseBlockSchema.extend({
  type: z.literal("Image"),
  image: imageSchema,
});

const linkBlockSchema = baseBlockSchema.extend({
  type: z.literal("Link"),
  image: imageSchema,
  content: markdownContentSchema.nullable(),
});

const textBlockSchema = baseBlockSchema.extend({
  type: z.literal("Text"),
  content: markdownContentSchema,
});

export const blockSchema = z.discriminatedUnion("type", [
  attachmentBlockSchema,
  channelSchema,
  embedBlockSchema,
  imageBlockSchema,
  linkBlockSchema,
  textBlockSchema,
]);
