import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteSSG from 'vite-plugin-ssr-ssg';
import fs from 'node:fs';

// Load the generated routes
const prerenderRoutes = fs.existsSync('./prerender-routes.json')
  ? JSON.parse(fs.readFileSync('./prerender-routes.json', 'utf-8'))
  : [];

export default defineConfig({
  plugins: [
    react(),
    ViteSSG({
      entry: 'src/main.tsx',
      routes: ['/', ...prerenderRoutes],
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
