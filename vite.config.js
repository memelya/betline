import { defineConfig } from 'vite';
export default defineConfig({
  base: '/betline/',
  build: { outDir: 'dist', target: 'esnext' },
  plugins: [{
    name: 'remove-crossorigin',
    transformIndexHtml: { order: 'post', handler(h) { return h.replace(/crossorigin\s*/g, ''); } }
  }],
});
