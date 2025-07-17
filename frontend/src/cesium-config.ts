// Configuração do CesiumJS
import { Ion } from 'cesium';

// Configurar o token de acesso do Cesium Ion (opcional, mas recomendado)
// Você pode obter um token gratuito em https://cesium.com/ion/signup/
// Ion.defaultAccessToken = 'seu-token-aqui';

// Configurar o caminho base para os assets do Cesium
if (typeof window !== 'undefined') {
  // Tentar diferentes caminhos para os assets
  const possiblePaths = [
    '/cesium/',
    '/node_modules/cesium/Build/Cesium/',
    'https://cesium.com/downloads/cesiumjs/releases/1.128/Build/Cesium/'
  ];

  // Verificar qual caminho está disponível
  const checkPath = async (path: string) => {
    try {
      const response = await fetch(`${path}Assets/`);
      return response.ok;
    } catch {
      return false;
    }
  };

  // Definir o caminho base
  (window as any).CESIUM_BASE_URL = '/cesium/';
  
  console.log('CesiumJS configurado com base URL:', (window as any).CESIUM_BASE_URL);
} 