import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dax-the-cat-game/',
  server: {
    port: 8080,
    open: true
  },
  build: {
    outDir: 'dist'
  }
});
