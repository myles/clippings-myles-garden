export type ArenaMarkdowContent = {
  markdown: string;
  html: string;
  plain: string;
};

export type ArenaMetadata = Record<string, string | number | boolean>;

export type ArenaEmbeddedUser = {
  id: number;
  type: "User";
  name: string;
  slug: string;
  avatar: string | null;
  initials: string;
};

export type ArenaEmbeddedGroup = {
  id: number;
  type: "Group";
  name: string;
  slug: string;
  avatar: string | null;
  initials: string;
};

export type ArenaEmbeddedConnection = {
  id: number;
  position: number;
  pinned: boolean;
  metadata: ArenaMetadata | null;
};

type ArenaPaginationMeta = {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  per_page: number;
  total_pages: number;
  total_count: number;
  has_more_pages: boolean;
};

export type ArenaListAPIResponse<T> = {
  data: T[];
  meta: ArenaPaginationMeta;
};
