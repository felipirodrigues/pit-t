import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexões externas
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    include: ['lucide-react'],
    exclude: [],
    force: true
  },
  resolve: {
    alias: {
      'cesium': path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/Cesium.js'),
      'cesium/Build/Cesium/Widgets/widgets.css': path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/Widgets/widgets.css'),
    }
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide-react': ['lucide-react'],
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/]
    }
  },
  define: {
    global: 'globalThis',
  }
});
