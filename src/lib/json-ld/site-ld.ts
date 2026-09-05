import type { WebSite } from "schema-dts";
import type { Channel } from "../schemas";
import urls from "../urls";
import { SITE_LANGUAGE } from "./constants";
import { absoluteUrl, websiteId } from "./utils";

/**
 * The site takes its name and description from the main Are.na channel,
 * the same way `Layout.astro` does.
 */
export const formatSiteToJsonLd = (
  mainChannel: Channel,
  site?: URL,
): WebSite => ({
  "@id": websiteId(site),
  "@type": "WebSite",
  url: absoluteUrl(urls.index(), site),
  name: mainChannel.data.title,
  description: mainChannel.data.description?.plain,
  inLanguage: SITE_LANGUAGE,
  sameAs: urls.external.channel(mainChannel.data.slug),
});
