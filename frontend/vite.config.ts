import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
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
    commonjsOptions: {
      exclude: [/node_modules\/(?!cesium)/],
      include: [/node_modules\/cesium/]
    }
  },
});
