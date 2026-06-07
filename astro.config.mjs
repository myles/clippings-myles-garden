// @ts-check
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import config from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: config.SITE_URL,
  image: {
    domains: ["d2w9rnfcy7mm78.cloudfront.net"],
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
});
