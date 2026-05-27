// @ts-check
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import config from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: config.CLIPPINGS_SITE,

  image: {
    domains: ["images.are.na"],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
