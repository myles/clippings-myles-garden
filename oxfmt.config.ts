import mylesOxfmtConfig from "@mylesb/oxfmt-config";
import { defineConfig } from "oxfmt";

export default defineConfig({
  ...mylesOxfmtConfig,
  ignorePatterns: ["dist"],
});
