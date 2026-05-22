import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    fs: {
      // Don't traverse into the cloned three.js source repo
      deny: ['three.js/**'],
    },
  },
  optimizeDeps: {
    // Limit dep scan to our entry + src; the cloned three.js/examples/*.html
    // pulls in third-party packages we don't need.
    entries: ['index.html', 'src/**/*.{js,jsx,ts,tsx}'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: (id) => id.includes('/three.js/examples/'),
    },
  },
});
