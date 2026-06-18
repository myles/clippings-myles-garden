import BlockFeedContent from "@/components/blocks/feed/BlockFeedContent.astro";
import type { RSSFeedItem, RSSOptions } from "@astrojs/rss";
import type { APIContext } from "astro";
import type { JsonFeedItem, JsonFeedOptions } from "astro-jsonfeed/types";
import { experimental_AstroContainer } from "astro/container";
import sanitizeHtml from "sanitize-html";
import type { Block } from "./schemas/block-schema.types";
import type { Channel } from "./schemas/channel-schema.types";
import urls from "./urls";

const isAbsoluteURL = (url: string): boolean => {
  return url.indexOf("://") > 0 || url.indexOf("//") === 0;
};

const sanitizePostHtml = (html: string, site: URL | undefined) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
    },
    transformTags: {
      // Transform the <a> and <img> tags whose href/src is not absolute to be
      // absolute.
      a: (tagName, attribs) => {
        const href = isAbsoluteURL(attribs.href)
          ? attribs.href
          : new URL(attribs.href, site).href;
        return { tagName, attribs: { ...attribs, href } };
      },
      img: (tagName, attribs) => {
        const src = isAbsoluteURL(attribs.src)
          ? attribs.src
          : new URL(attribs.src, site).href;
        return { tagName, attribs: { ...attribs, src } };
      },
    },
  });

const container = await experimental_AstroContainer.create();

export const formatBlockToFeedContent = async (
  block: Block,
  context: APIContext,
): Promise<string> => {
  const { site } = context;

  const rawContent = await container.renderToString(BlockFeedContent, {
    props: { block },
  });

  return sanitizePostHtml(rawContent, site);
};

export const formatChannelToFeedJson = async (
  channel: Channel,
  context: APIContext,
): Promise<JsonFeedOptions> => ({
  title: channel.data.title,
  description: channel.data.description?.plain ?? undefined,
  home_page_url: new URL(urls.index(), context.site).href,
  items: [],
});

export const formatBlockToFeedJsonItem = async (
  block: Block,
  context: APIContext,
): Promise<JsonFeedItem> => ({
  id: urls.block.detail(block.id),
  url: new URL(urls.block.detail(block.id), context.site).href,
  external_url: urls.external.block(block.id),
  title: block.data.title ?? undefined,
  summary: block.data.description?.plain ?? undefined,
  date_published: block.data.created_at,
  date_modified: block.data.updated_at,
  content_html: await formatBlockToFeedContent(block, context),
});

export const formatChannelToFeedXML = async (
  channel: Channel,
  context: APIContext,
): Promise<RSSOptions> => ({
  title: channel.data.title,
  description: channel.data.description ? channel.data.description.plain : "",
  site: new URL(urls.index(), context.site).href,
  items: [],
});

export const formatBlockToFeedXMLItem = async (
  block: Block,
  context: APIContext,
): Promise<RSSFeedItem> => ({
  title: block.data.title ?? "",
  description: block.data.description?.plain ?? undefined,
  pubDate: block.data.created_at,
  link: new URL(urls.block.detail(block.id), context.site).href,
  content: await formatBlockToFeedContent(block, context),
});
