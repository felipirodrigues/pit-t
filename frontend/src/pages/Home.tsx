import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import { MapPin, Search, ZoomIn, ZoomOut, Globe as GlobeIcon, RotateCcw, Loader2, Menu } from 'lucide-react';
import * as THREE from 'three';
import Sidebar from '../components/layout/Sidebar';
import clouds from '../images/clouds.png';
import api, { API_BASE_URL } from '../services/api';
import logoPitt from '../images/logo-potedes.png'; // Importe a logo do sistema
import map from '../images/mapa.png';

// Estilos para os marcadores do mapa
const markerStyles = `
.marker-element {
  position: relative;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.marker-element:hover {
  transform: translate(-50%, -50%) scale(1.3);
}
`;

interface TwinCity {
  id: number;
  cityA_name: string;
  cityA_latitude: number;
  cityA_longitude: number;
  cityB_name: string;
  cityB_latitude: number;
  cityB_longitude: number;
  description?: string;
}

interface CloudData {
  lat: number;
  lng: number;
  size: number;
  alt: number;
  cloudColor: string;
  rotateSpeed: number;
}

// Cores diferentes para cada par de cidades gêmeas
const TWIN_CITY_COLORS = [
  '#feca57', // Amarelo (cor única para todos os marcadores)
];

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [twinCities, setTwinCities] = useState<TwinCity[]>([]);
  const [filteredTwinCities, setFilteredTwinCities] = useState<TwinCity[]>([]);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isGlobeReady, setGlobeReady] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const globeRef = useRef<any>();
  
  // Gerar dados de nuvens
  const [cloudsData, setCloudsData] = useState<CloudData[]>([]);
  
  useEffect(() => {
    // Gerar camadas de nuvens
    const clouds: CloudData[] = [];
    const numClouds = 2;
    
    for (let i = 0; i < numClouds; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI - Math.PI / 2;
      
      clouds.push({
        lat: (theta * 180) / Math.PI,
        lng: (phi * 180) / Math.PI,
        size: Math.random() / 3 + 0.1,
        alt: Math.random() * 0.3 + 0.1,
        cloudColor: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.2})`,
        rotateSpeed: Math.random() / 150
      });
    }
    
    setCloudsData(clouds);
  }, []);

  // Atualizar dimensões quando a janela for redimensionada
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setDimensions({ width, height });
    setIsMobile(width < 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Adicionar camada de nuvens usando Three.js
  useEffect(() => {
    if (globeRef.current && isGlobeReady) {
      const globe = globeRef.current;
      
      // URL correta da textura das nuvens do exemplo oficial da documentação
      const CLOUDS_IMG_URL = clouds; // Usar a imagem importada
      const CLOUDS_ALT = 0.004;
      const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame
      
      // Carregar a textura das nuvens
      new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
        // Criar uma esfera para as nuvens
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
          new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            //opacity: 1.0
          })
        );
        
        // Adicionar à cena
        globe.scene().add(clouds);
        
        // Rotação inicial para posicionar corretamente
        clouds.rotation.x = Math.PI / 8;
        
        // Animação para rotacionar as nuvens
        (function rotateClouds() {
          clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
          requestAnimationFrame(rotateClouds);
        })();
      });
    }
  }, [isGlobeReady]);

  // Carregar dados das cidades gêmeas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/twin-cities');
        setTwinCities(response.data);
        setFilteredTwinCities(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados das cidades gêmeas:', error);
        setTwinCities([]);
        setFilteredTwinCities([]);
      }
    };

    fetchData();
  }, []);

  // Função para filtrar cidades gêmeas
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTwinCities(twinCities);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = twinCities.filter(
        twinCity => 
          twinCity.cityA_name.toLowerCase().includes(searchTermLower) ||
          twinCity.cityB_name.toLowerCase().includes(searchTermLower) ||
          (twinCity.description && twinCity.description.toLowerCase().includes(searchTermLower))
      );
      setFilteredTwinCities(filtered);
    }
  }, [searchTerm, twinCities]);

  // Foco automático no Brasil
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: -14.235, lng: -51.9253, altitude: 0.9 });
      
      // Configurar rotação automática
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.04;
    }
  }, []);

  // Função para determinar a cor dos pontos baseado em hover
  const getTwinCityColor = (twinCity: TwinCity) => {
    if (twinCity.id === hoveredId) return '#54a0ff'; // Azul quando hover
    
    // Retorna a cor amarela para todos os pontos
    return '#feca57';
  };

  // Funções para controle do zoom
  const handleZoom = (direction: 'in' | 'out') => {
    if (globeRef.current) {
      const currentPOV = globeRef.current.pointOfView();
      const newAltitude = direction === 'in' 
        ? Math.max(0.5, currentPOV.altitude * 0.7)
        : Math.min(10, currentPOV.altitude * 1.3);
      
      globeRef.current.pointOfView({
        ...currentPOV,
        altitude: newAltitude
      }, 300);
    }
  };

  // Função para resetar a visão do globo
  const resetView = () => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ 
        lat: -14.235, 
        lng: -51.9253, 
        altitude: 2.5 
      }, 1000);
    }
  };

  // Função para navegar para a página de detalhes
  const handleLocationClick = (locationId: number) => {
    navigate(`/location/${locationId}`);
  };

  // Função para alternar a visibilidade da sidebar no mobile
  const toggleSidebar = () => {
    // Aqui podemos adicionar lógica para mostrar/esconder a sidebar no mobile
    setIsSidebarOpen(!isSidebarOpen);
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
      sidebarElement.classList.toggle('sidebar-open');
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Sidebar />
      
      {/* Estilos para marcadores */}
      <style>{markerStyles}</style>
      
      {/* Overlay para quando o sidebar estiver aberto no mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Globo principal */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!isGlobeReady && (
          <div className="flex flex-col items-center justify-center z-10 bg-slate-900/80 w-full h-full">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg">Carregando o mapa...</p>
          </div>
        )}
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          
          // Configuração do modelo clouds
          //globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          globeImageUrl={map}
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          
          // Configurações básicas
          enablePointerInteraction={true}
          animateIn={true}
          waitForGlobeReady={true}
          atmosphereColor="lightskyblue"
          atmosphereAltitude={0.15}
          
          // Marcadores HTML para cidades gêmeas
          htmlElementsData={filteredTwinCities}
          htmlLat={(d) => (d as TwinCity).cityA_latitude}
          htmlLng={(d) => (d as TwinCity).cityA_longitude}
          htmlAltitude={0.002}
          htmlElement={(d) => {
            const el = document.createElement('div');
            el.className = 'marker-element';
            const twinCity = d as TwinCity;
            const color = getTwinCityColor(twinCity);
            el.style.color = color;
            el.style.width = '28px';
            el.style.height = '28px';
            el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'pointer';
            
            el.addEventListener('mouseenter', () => {
              setHoverInfo(d);
              setHoveredId((d as TwinCity).id);
            });
            
            el.addEventListener('mouseleave', () => {
              setHoverInfo(null);
              setHoveredId(null);
            });
            
            el.addEventListener('click', () => {
              const twinCity = d as TwinCity;
              if (globeRef.current) {
                globeRef.current.pointOfView({ 
                  lat: twinCity.cityA_latitude, 
                  lng: twinCity.cityA_longitude, 
                  altitude: 1.2
                }, 500);
                
                // Aguardar a animação do globo antes de navegar
                setTimeout(() => {
                  handleLocationClick(twinCity.id);
                }, 600);
              }
            });
            
            return el;
          }}
          onGlobeReady={() => setGlobeReady(true)}
        />
      </div>

      {/* Barra superior com logo no mobile - 3 colunas */}
      <div className="fixed top-0 left-0 right-0 z-20 md:hidden">
        <div className="bg-green-800 border-b border-green-700 px-2 py-2">
          <div className="grid grid-cols-[20%_60%_20%] items-center">
            {/* Coluna 1: Logo */}
            <div className="flex items-center justify-start">
              <img src={logoPitt} alt="PITT Logo" className="h-8 w-auto" />
            </div>
            
            {/* Coluna 2: Texto centralizado */}
            <div className="text-center">
              <h1 className="text-white text-xs font-medium leading-tight">
                Plataforma interativa de<br />tipologias transfronteiriças
              </h1>
            </div>
            
            {/* Coluna 3: Botão menu hambúrguer */}
            <div className="flex justify-end">
              <button 
                onClick={toggleSidebar}
                className="menu-button w-8 h-8 flex items-center justify-center rounded-md text-white hover:bg-green-700"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Superior - Cidades Gêmeas */}
      <div className="fixed md:right-0 bottom-0 md:top-0 md:bottom-auto w-full md:w-72 flex md:flex-col items-center justify-center pointer-events-none z-10">
        <div className="w-full md:w-full md:h-auto flex flex-col md:flex-col gap-2 md:gap-3 px-2 md:px-4">
          <div className="relative md:static flex flex-col md:h-auto bg-black/50 backdrop-blur-sm rounded-lg pointer-events-auto border border-white/10 max-h-[50vh] md:max-h-[70vh]">
            <div className="md:hidden absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full p-1 border border-white/10">
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                onClick={() => {
                  const container = document.getElementById('cities-container');
                  if (container) {
                    container.classList.toggle('h-0');
                    container.classList.toggle('h-40');
                  }
                }}
              >
                <MapPin className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="p-3 flex flex-col h-full">
              <h2 className="text-base font-semibold mb-2 text-white flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('twinCities')}
              </h2>
              
              <div id="cities-container" className="h-40 md:h-64 md:max-h-[60vh] overflow-y-auto pr-1 transition-all duration-300 flex-grow">
                {filteredTwinCities.map((city) => (
                  <div
                    key={city.id}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                      city.id === hoveredId 
                        ? 'bg-white/20 scale-105' 
                        : 'hover:bg-white/10'
                    }`}
                    onMouseEnter={() => {
                      setHoverInfo({
                        ...city,
                        lat: Number(city.cityA_latitude),
                        lng: Number(city.cityA_longitude)
                      });
                      setHoveredId(city.id);
                    }}
                    onMouseLeave={() => {
                      setHoverInfo(null);
                      setHoveredId(null);
                    }}
                    onClick={() => {
                      if (globeRef.current) {
                        // Definir um ponto médio entre as duas cidades para visualização
                        const midLat = (city.cityA_latitude + city.cityB_latitude) / 2;
                        const midLng = (city.cityA_longitude + city.cityB_longitude) / 2;
                        
                        globeRef.current.pointOfView({ 
                          lat: midLat, 
                          lng: midLng, 
                          altitude: 1.5 
                        }, 500);
                        
                        // Aguardar a animação do globo antes de navegar
                        setTimeout(() => {
                          handleLocationClick(city.id);
                        }, 600);
                      }
                    }}
                  >
                    <div 
                      className="w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{
                        backgroundColor: city.id === hoveredId
                          ? 'rgba(84, 160, 255, 0.5)'  // Azul quando hover (versão com transparência)
                          : 'rgba(254, 202, 87, 0.5)'  // Amarelo com transparência
                      }}
                    >
                      <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white text-xs md:text-sm font-medium truncate">{city.cityA_name} - {city.cityB_name}</h3>
                    </div>
                  </div>
                ))}
                
                {filteredTwinCities.length === 0 && (
                  <div className="text-white/70 text-sm py-2 text-center">
                    {t('noTwinCitiesFound')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nuvens como camada secundária */}
      <div className="absolute inset-0 pointer-events-none">
        <Globe
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="transparent"
          showGlobe={false}
          showAtmosphere={false}
          
          // Nuvens
          customLayerData={cloudsData}
          customThreeObject={(d: any) => {
            const cloud = d as CloudData;
            // Criar a nuvem usando texturas
            const cloudMaterial = new THREE.SpriteMaterial({
              map: new THREE.TextureLoader().load(clouds),
              transparent: true,
              opacity: 0.7,
              color: new THREE.Color(cloud.cloudColor)
            });
            
            const sprite = new THREE.Sprite(cloudMaterial);
            sprite.scale.set(cloud.size, cloud.size, 1);
            return sprite;
          }}
          customThreeObjectUpdate={(obj: any, d: any) => {
            const cloud = d as CloudData;
            const globeInstance = globeRef.current;
            
            if (globeInstance) {
              // Atualizar posição das nuvens
              Object.assign(obj.position, globeInstance.getCoords(cloud.lat, cloud.lng, cloud.alt));
              
              // Girar lentamente as nuvens
              cloud.lng += cloud.rotateSpeed;
              if (cloud.lng > 180) cloud.lng -= 360;
            }
          }}
        />
      </div>

      {/* Controles do mapa */}
      <div className="fixed left-4 top-20 md:top-auto md:bottom-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => handleZoom('in')}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
        >
          <ZoomIn className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
        >
          <ZoomOut className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={resetView}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
        >
          <RotateCcw className="w-6 h-6 text-white" />
        </button>
      </div>

      
    </div>
  );
};

export default Home;
