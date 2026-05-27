import type {
  ArenaMarkdowContent,
  ArenaEmbeddedUser,
  ArenaMetadata,
  ArenaEmbeddedGroup,
  ArenaEmbeddedConnection,
} from "./types";

export type ArenaChannel = {
  id: number;
  type: "Channel";
  slug: string;
  title: string;
  description: ArenaMarkdowContent | null;
  state: "available" | "deleted";
  visibility: "public" | "private" | "closed";
  created_at: string;
  updated_at: string;
  metadata: ArenaMetadata | null;
  owner: ArenaEmbeddedUser | ArenaEmbeddedGroup;
  counts: ArenaChannelCount;
  collaborators: (ArenaEmbeddedUser | ArenaEmbeddedGroup)[];
  _links: {
    self: {
      href: string;
    };
  };
  connection: ArenaEmbeddedConnection;
  can: ArenaChannelAbilities | null;
};

type ArenaChannelCount = {
  blocks: number;
  channels: number;
  contents: number;
  collaborators: number;
};

type ArenaChannelAbilities = {
  add_to: boolean;
  update: boolean;
  destory: boolean;
  manage_collaborators: boolean;
};
