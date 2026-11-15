export type StorageClientOptions = {
  zoneName: string;
  accessKey: string;
  region: string;
};

export type StorageClient = {
  listFileNames: (directory: string) => Promise<Set<string>>;
  uploadFile: (
    path: string,
    body: ReadableStream<Uint8Array>,
    contentType?: string,
  ) => Promise<void>;
};
