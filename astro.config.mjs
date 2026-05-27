// @ts-check
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import config from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: config.CLIPPINGS_SITE,
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
});
