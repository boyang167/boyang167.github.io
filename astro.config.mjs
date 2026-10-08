import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://boyang167.github.io",
  output: "static",
  integrations: [mdx(), sitemap()],
});
