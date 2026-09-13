import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { apiMiddleware } from './server/apiMiddleware.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'havan-api-server',
      configureServer(server) {
        server.middlewares.use(apiMiddleware());
      }
    }
  ],
  server: {
    port: 3001,
    host: true,
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/Sufi-music/**', '**/house_party/**', '**/data/**']
    }
  }
});

