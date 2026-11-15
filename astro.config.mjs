// @ts-check
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import config from "./src/config";

const ARENA_IMAGE_HOST = "d2w9rnfcy7mm78.cloudfront.net";

// Mirrored media is served from the Bunny pull zone; Are.na stays allowed as
// the fallback when a file couldn't be mirrored.
const IMAGE_HOSTS = config.BUNNY
  ? [ARENA_IMAGE_HOST, new URL(config.BUNNY.PULL_ZONE_URL).hostname]
  : [ARENA_IMAGE_HOST];

/**
 * Widths that Vercel's Image Optimization API is allowed to produce. Any
 * `widths` passed to `<Image>` must appear here — the adapter silently drops
 * the ones that don't, collapsing the srcset to a single entry.
 */
const IMAGE_SIZES = [384, 640, 768, 1080, 1536, 1920];

// https://astro.build/config
export default defineConfig({
  site: config.SITE_URL,
  image: {
    domains: IMAGE_HOSTS,
  },
  redirects: {
    "/block": "/",
    "/channel": "/",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel({
    // Hand image optimization to Vercel instead of encoding every variant with
    // sharp at build time. Are.na's images are resized on demand at the edge
    // and cached there, so build time no longer scales with the channel size.
    imageService: true,
    imagesConfig: {
      // `domains` is intentionally omitted — the adapter appends the
      // `image.domains` above, and setting it here duplicates the entry.
      sizes: IMAGE_SIZES,
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: 60 * 60 * 24 * 365,
    },
  }),
});
