import { formatISO } from "date-fns";
import type {
  Article,
  Collection,
  ImageObject,
  MediaObject,
  VideoObject,
  WebPage,
} from "schema-dts";
import {
  isAttachmentBlock,
  isChannelBlock,
  isEmbedBlock,
  isImageBlock,
  isLinkBlock,
  isTextBlock,
} from "../content";
import type { Block } from "../schemas";
import urls from "../urls";
import { NODE_FRAGMENT, SITE_LANGUAGE } from "./constants";
import { formatImageToJsonLd, formatPixelsToJsonLd } from "./image-ld";
import { formatUserToJsonLd } from "./user-ld";
import { absoluteUrl, nodeId, websiteId } from "./utils";

/** The oEmbed type Are.na reports for blocks embedding a video player. */
const OEMBED_VIDEO_TYPE = "video";

export type BlockEntity =
  Article | Collection | ImageObject | MediaObject | VideoObject | WebPage;

const formatSharedFields = (block: Block, site?: URL) => {
  const url = absoluteUrl(urls.block.detail(block.id), site);

  // Channel blocks carry no user, so the author is only sometimes known.
  const user = "user" in block.data ? block.data.user : undefined;

  return {
    "@id": nodeId(url, NODE_FRAGMENT.block),
    url,
    name: block.data.title ?? undefined,
    description: block.data.description?.plain,
    dateCreated: formatISO(block.data.created_at),
    dateModified: formatISO(block.data.updated_at),
    inLanguage: SITE_LANGUAGE,
    sameAs: urls.external.block(block.id),
    author: user ? formatUserToJsonLd(user) : undefined,
  };
};

/**
 * Describe the thing a block *is*, picking the schema.org type that best
 * fits the Are.na block type.
 */
export const formatBlockToEntity = (block: Block, site?: URL): BlockEntity => {
  const sharedFields = formatSharedFields(block, site);
  const imageId = nodeId(sharedFields.url, NODE_FRAGMENT.image);

  if (isTextBlock(block)) {
    return {
      ...sharedFields,
      "@type": "Article",
      articleBody: block.data.content.plain,
    };
  }

  if (isImageBlock(block)) {
    const { image } = block.data;

    return {
      ...sharedFields,
      "@type": "ImageObject",
      name: sharedFields.name ?? image.filename,
      contentUrl: image.src,
      encodingFormat: image.content_type,
      caption: image.alt_text ?? undefined,
      width: formatPixelsToJsonLd(image.width),
      height: formatPixelsToJsonLd(image.height),
    };
  }

  if (isLinkBlock(block)) {
    return {
      ...sharedFields,
      "@type": "WebPage",
      image: formatImageToJsonLd(block.data.image, imageId),
      text: block.data.content?.plain,
      // A link block bookmarks a page elsewhere, so record that page as
      // the work this node is based on.
      isBasedOn: block.data.source?.url,
    };
  }

  if (isEmbedBlock(block)) {
    const { embed } = block.data;

    const mediaFields = {
      ...sharedFields,
      image: formatImageToJsonLd(block.data.image, imageId),
      embedUrl: embed.url ?? undefined,
      thumbnailUrl: embed.thumbnail_url ?? undefined,
      width: formatPixelsToJsonLd(embed.width),
      height: formatPixelsToJsonLd(embed.height),
      uploadDate: sharedFields.dateCreated,
    };

    if (embed.type === OEMBED_VIDEO_TYPE) {
      return { ...mediaFields, "@type": "VideoObject" };
    }

    return { ...mediaFields, "@type": "MediaObject" };
  }

  if (isAttachmentBlock(block)) {
    const { attachment } = block.data;

    return {
      ...sharedFields,
      "@type": "MediaObject",
      name: sharedFields.name ?? attachment.filename ?? undefined,
      image: formatImageToJsonLd(block.data.image, imageId),
      contentUrl: attachment.url,
      encodingFormat: attachment.content_type ?? undefined,
      contentSize: attachment.file_size?.toString(),
    };
  }

  if (isChannelBlock(block)) {
    return {
      ...sharedFields,
      "@type": "Collection",
      sameAs: urls.external.channel(block.data.slug),
    };
  }

  console.warn(`Unsupported block type: ${block.data.type}`);

  return { ...sharedFields, "@type": "WebPage" };
};

/** Describe the page a block is served on. */
export const formatBlockToJsonLd = (block: Block, site?: URL): WebPage => {
  const url = absoluteUrl(urls.block.detail(block.id), site);

  return {
    "@id": nodeId(url, NODE_FRAGMENT.webpage),
    "@type": "WebPage",
    url,
    name: block.data.title ?? undefined,
    description: block.data.description?.plain,
    inLanguage: SITE_LANGUAGE,
    isPartOf: { "@id": websiteId(site) },
    dateCreated: formatISO(block.data.created_at),
    dateModified: formatISO(block.data.updated_at),
    mainEntity: formatBlockToEntity(block, site),
  };
};
