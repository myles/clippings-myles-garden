import type { Block, Channel } from "@aredotna/sdk";

import type { StorageClient } from "@/lib/bunny/storage-client.types";

export type MediaMirrorOptions = {
  storage: StorageClient;
  // Pull zone base URL that serves the storage zone, e.g. https://x.b-cdn.net
  publicUrl: string;
};

export type MediaMirror = {
  mirrorUrl: (sourceUrl: string) => Promise<string>;
  mirrorBlock: <T extends Block | Channel>(block: T) => Promise<T>;
};
