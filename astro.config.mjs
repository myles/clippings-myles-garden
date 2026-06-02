// @ts-check
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import config from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: config.SITE_URL,
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
});
