import type { Page } from "astro";
import { formatISO } from "date-fns";
import type { CollectionPage, ItemList } from "schema-dts";
import type { Block, Channel } from "../schemas";
import urls from "../urls";
import { NODE_FRAGMENT, SITE_LANGUAGE } from "./constants";
import { absoluteUrl, nodeId, websiteId } from "./utils";

/**
 * One page only carries a window of the channel, so the list reports the
 * size of the whole channel and gives each block its position within it
 * rather than its position on the page.
 */
export const formatPageToItemList = (
  page: Page<Block>,
  site?: URL,
): ItemList => ({
  "@type": "ItemList",
  numberOfItems: page.total,
  itemListElement: page.data.map((block, index) => ({
    "@type": "ListItem",
    position: page.start + index + 1,
    url: absoluteUrl(urls.block.detail(block.id), site),
    name: block.data.title ?? undefined,
  })),
});

/**
 * A channel page lists the blocks connected to it, so it is described as a
 * CollectionPage whose main entity is the list of those blocks. Each page
 * of the channel is a distinct node, identified by its own URL.
 */
export const formatChannelToJsonLd = (
  channel: Channel,
  page: Page<Block>,
  site?: URL,
): CollectionPage => {
  const url = absoluteUrl(page.url.current, site);

  const name =
    page.currentPage === 1
      ? channel.data.title
      : `${channel.data.title} (page ${page.currentPage})`;

  return {
    "@id": nodeId(url, NODE_FRAGMENT.webpage),
    "@type": "CollectionPage",
    url,
    name,
    description: channel.data.description?.plain,
    inLanguage: SITE_LANGUAGE,
    isPartOf: { "@id": websiteId(site) },
    sameAs: urls.external.channel(channel.data.slug),
    dateCreated: formatISO(channel.data.created_at),
    dateModified: formatISO(channel.data.updated_at),
    mainEntity: formatPageToItemList(page, site),
  };
};
