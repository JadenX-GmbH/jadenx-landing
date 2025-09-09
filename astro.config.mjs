// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://test.jadenx.com",
  integrations: [
    mdx(),
    sitemap()
  ],
  output: 'static',
  build: {
    // Generate files in /dist for GitHub Pages
    outDir: './dist'
  }
});
