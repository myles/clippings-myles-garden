import type { Block, Channel } from "@aredotna/sdk";

export type ArenaClientOptions = {
  apiKey?: string;
  maxRetries?: number;
};

export type ArenaClient = {
  getChannel: (channelId: string | number) => Promise<Channel>;
  getBlock: (blockId: number) => Promise<Block>;
  getChannelContents: (
    channelId: string | number,
    per: number,
  ) => Promise<(Block | Channel)[]>;
};
