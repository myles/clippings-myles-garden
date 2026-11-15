import * as BunnyStorageSDK from "@bunny.net/storage-sdk";

import type {
  StorageClient,
  StorageClientOptions,
} from "./storage-client.types";

const { StorageRegion } = BunnyStorageSDK.regions;

type SdkUploadStream = Parameters<typeof BunnyStorageSDK.file.upload>[2];

// The SDK throws a plain Error with this prefix when Bunny answers 404.
const NOT_FOUND_MESSAGE_PREFIX = "File not found";

/**
 * Bunny Storage SDK wrapper, so the rest of the code never touches the SDK's
 * namespaced API and a breaking SDK release stays contained to this file.
 */
export function createStorageClient({
  zoneName,
  accessKey,
  region,
}: StorageClientOptions): StorageClient {
  const zone = BunnyStorageSDK.zone.connect_with_accesskey(
    parseRegion(region),
    zoneName,
    accessKey,
  );

  return {
    listFileNames: async (directory) => {
      try {
        const files = await BunnyStorageSDK.file.list(zone, directory);
        return new Set(
          files.filter((file) => !file.isDirectory).map((f) => f.objectName),
        );
      } catch (error) {
        // A missing directory just means nothing has been uploaded yet.
        if (isNotFound(error)) {
          return new Set();
        }
        throw error;
      }
    },

    uploadFile: async (path, body, contentType) => {
      // Same web stream at runtime; the SDK's types were built against an
      // older lib.dom ReadableStream that Node's typings no longer match.
      const stream = body as SdkUploadStream;
      await BunnyStorageSDK.file.upload(zone, path, stream, { contentType });
    },
  };
}

function parseRegion(region: string): BunnyStorageSDK.regions.StorageRegion {
  const regions = Object.values(StorageRegion) as string[];
  if (!regions.includes(region)) {
    throw new Error(
      `Unknown Bunny storage region "${region}". ` +
        `Use one of: ${regions.join(", ")}.`,
    );
  }

  return region as BunnyStorageSDK.regions.StorageRegion;
}

function isNotFound(error: unknown): boolean {
  return (
    error instanceof Error && error.message.startsWith(NOT_FOUND_MESSAGE_PREFIX)
  );
}
