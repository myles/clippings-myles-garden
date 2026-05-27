// @ts-check
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://clippings.myles.garden",

  image: {
    domains: ["images.are.na"],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
