import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Plugin para copiar assets do CesiumJS
function cesiumAssetsPlugin() {
  return {
    name: 'cesium-assets',
    configureServer(server: any) {
      console.log('Configurando assets do CesiumJS...');
      
      // Copiar assets do CesiumJS para a pasta pública durante o desenvolvimento
      const cesiumAssetsPath = path.resolve(__dirname, 'node_modules/cesium/Build/Cesium');
      const publicCesiumPath = path.resolve(__dirname, 'public/cesium');
      
      console.log('Caminho fonte:', cesiumAssetsPath);
      console.log('Caminho destino:', publicCesiumPath);
      
      if (!fs.existsSync(cesiumAssetsPath)) {
        console.error('Caminho fonte do CesiumJS não encontrado:', cesiumAssetsPath);
        return;
      }
      
      if (!fs.existsSync(publicCesiumPath)) {
        fs.mkdirSync(publicCesiumPath, { recursive: true });
        console.log('Pasta pública do CesiumJS criada');
      }
      
      // Copiar Assets, Workers e Widgets
      ['Assets', 'Workers', 'Widgets'].forEach(dir => {
        const sourcePath = path.join(cesiumAssetsPath, dir);
        const destPath = path.join(publicCesiumPath, dir);
        
        if (fs.existsSync(sourcePath)) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          
          // Copiar arquivos recursivamente
          function copyDir(src: string, dest: string) {
            const entries = fs.readdirSync(src, { withFileTypes: true });
            
            for (const entry of entries) {
              const srcPath = path.join(src, entry.name);
              const destPath = path.join(dest, entry.name);
              
              if (entry.isDirectory()) {
                if (!fs.existsSync(destPath)) {
                  fs.mkdirSync(destPath, { recursive: true });
                }
                copyDir(srcPath, destPath);
              } else {
                fs.copyFileSync(srcPath, destPath);
              }
            }
          }
          
          copyDir(sourcePath, destPath);
          console.log(`Pasta ${dir} copiada com sucesso`);
        } else {
          console.warn(`Pasta ${dir} não encontrada em:`, sourcePath);
        }
      });
      
      console.log('Assets do CesiumJS configurados com sucesso!');
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cesiumAssetsPlugin()],
  server: {
    host: '0.0.0.0', // Permite conexões externas
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    include: ['lucide-react', 'cesium'],
    exclude: [],
    force: true
  },
  resolve: {
    alias: {
      'cesium': path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/Cesium.js'),
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
          'cesium': ['cesium'],
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
