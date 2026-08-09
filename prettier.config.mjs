import mylesPrettierConfig from "@mylesb/prettier-config";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...mylesPrettierConfig,
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-organize-imports",
    "prettier-plugin-astro-organize-imports",
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
