import config from "@/config";
import urls from "../urls";
import { NODE_FRAGMENT, type NodeFragment } from "./constants";

/**
 * Resolve a site relative path against the deployed site origin. `site` is
 * `Astro.site`, which is optional, so fall back to the value the Astro
 * config builds it from.
 */
export const absoluteUrl = (path: string, site?: URL): string =>
  new URL(path, site ?? config.SITE_URL).href;

export const nodeId = (url: string, fragment: NodeFragment): string =>
  `${url}${fragment}`;

/** The `@id` every page level node points at through `isPartOf`. */
export const websiteId = (site?: URL): string =>
  nodeId(absoluteUrl(urls.index(), site), NODE_FRAGMENT.website);
