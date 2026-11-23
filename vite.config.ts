import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: 'web',
  build: {
    outDir: '../dist/web',
    emptyOutDir: true,
    rollupOptions: {
      input: [
        fileURLToPath(new URL('./web/main.html', import.meta.url)),
        fileURLToPath(new URL('./web/sudoku.html', import.meta.url)),
      ],
    },
  },
});
