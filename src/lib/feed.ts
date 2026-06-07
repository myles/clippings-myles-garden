import BlockFeedContent from "@/components/blocks/feed/BlockFeedContent.astro";
import type { APIContext } from "astro";
import { experimental_AstroContainer } from "astro/container";
import sanitizeHtml from "sanitize-html";
import type { Block } from "./schemas/block-schema.types";

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
