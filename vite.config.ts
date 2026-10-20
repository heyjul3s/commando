import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    // Lightning CSS currently rejects BrowserUX 5's ::search-text:current selector.
    cssMinify: 'esbuild',
  },
  plugins: [react()],
});
