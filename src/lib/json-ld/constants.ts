/** Every channel and block on the site is syndicated from Are.na. */
export const ARENA_NAME = "Are.na";

/** Matches the `lang` attribute set on the document in `Layout.astro`. */
export const SITE_LANGUAGE = "en";

/**
 * Fragments appended to a page URL to give each JSON-LD node a stable
 * `@id`, so that nodes sharing a graph can reference one another.
 */
export const NODE_FRAGMENT = {
  website: "#website",
  webpage: "#webpage",
  block: "#block",
  image: "#image",
} as const;

export type NodeFragment = (typeof NODE_FRAGMENT)[keyof typeof NODE_FRAGMENT];
