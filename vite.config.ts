import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  // Dynamically import the plugin to avoid the ESM import crash]

  return {
    plugins: [
      react(),
    ],
    // your existing config
    build: {
      outDir: 'build',  // change output folder from dist to build
      target: 'es2015', // 👈 fallback target for wider compatibility
      rollupOptions: {
        input: 'index.html'
      }
    },
    server: {
      fs: {
        allow: ['.']
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
