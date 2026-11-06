import mylesOxlintConfig from "@mylesb/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [mylesOxlintConfig],
  rules: {
    "no-console": "allow",
  },
});
