import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://www.dialivzw.eu',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: false,
});
