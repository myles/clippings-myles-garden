import type { ArenaChannel } from "./channel-loader.types";
import type {
  ArenaEmbeddedConnection,
  ArenaEmbeddedUser,
  ArenaMarkdowContent,
  ArenaMetadata,
} from "./types";

type ArenaBlockSource = {
  url: string;
  title: string | null;
  provider: {
    name: string;
    url: string;
  };
};

type ArenaBlockAbilities = {
  manage: boolean;
  comment: boolean;
  connect: boolean;
};

type AreanImageVersion = {
  src: string;
  src_2x: string;
  width: number | null;
  height: number | null;
};

type ArenaBlockImage = {
  alt_text: string | null;
  blurhash: string | null;
  width: number | null;
  height: number | null;
  src: string;
  aspect_ratio: number | null;
  content_type: string;
  filename: string;
  file_size: number | null;
  updated_at: string;
  small: AreanImageVersion;
  medium: AreanImageVersion;
  large: AreanImageVersion;
  square: AreanImageVersion;
};

type ArenaBlockAttachment = {
  filename: string | null;
  content_type: string | null;
  file_size: number | null;
  file_extension: string | null;
  updated_at: string | null;
  url: string;
};

type ArenaBlockEmbed = {
  url: string | null;
  type: string | null;
  title: string | null;
  author_name: string | null;
  author_url: string | null;
  source_url: string | null;
  width: number | null;
  height: number | null;
  html: string | null;
  thumbnail_url: string | null;
};

type ArenaBaseBlock = {
  id: number;
  base_type: "Block";
  title: string | null;
  description: ArenaMarkdowContent;
  state: "processing" | "available" | "failed";
  visibility: "public" | "private" | "orphan";
  comment_count: number;
  created_at: string;
  updated_at: string;
  user: ArenaEmbeddedUser;
  source: ArenaBlockSource;
  metadata: ArenaMetadata | null;
  _links: Record<string, string>;
  connection: ArenaEmbeddedConnection | null;
  can: ArenaBlockAbilities | null;
};

export type ArenaTextBlock = ArenaBaseBlock & {
  type: "Text";
  content: ArenaMarkdowContent;
};

export type ArenaImageBlock = ArenaBaseBlock & {
  type: "Image";
  image: ArenaBlockImage;
};

export type ArenaLinkBlock = ArenaBaseBlock & {
  type: "Link";
  image: ArenaBlockImage;
  content?: ArenaMarkdowContent;
};

export type ArenaAttachmentBlock = ArenaBaseBlock & {
  type: "Attachment";
  attachment: ArenaBlockAttachment;
  image: ArenaBlockImage;
};

export type ArenaEmbedBlock = ArenaBaseBlock & {
  type: "Embed";
  embed: ArenaBlockEmbed;
  image: ArenaBlockImage;
};

export type ArenaBlock =
  | ArenaTextBlock
  | ArenaImageBlock
  | ArenaLinkBlock
  | ArenaAttachmentBlock
  | ArenaEmbedBlock
  | ArenaChannel;
