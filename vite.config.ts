import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: './',
  publicDir: 'public',
  server: {
    port: 8080,
    open: false,
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1200,
    minify: command === 'build' ? 'esbuild' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
}));
