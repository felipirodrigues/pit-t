import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import axios from 'axios';
import { MapPin, Search, ZoomIn, ZoomOut, Globe as GlobeIcon, RotateCcw, Loader2 } from 'lucide-react';
import * as THREE from 'three';
import mockLocations from '../mocks/locations.json';
import Sidebar from '../components/layout/Sidebar';

interface Location {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const globeRef = useRef<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [isGlobeReady, setGlobeReady] = useState(false);

  // Atualizar dimensões quando a janela for redimensionada
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar localizações
        const locationsResponse = await axios.get('http://localhost:3000/api/locations');
        setLocations(locationsResponse.data);
        setFilteredLocations(locationsResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        // Usar dados mockados se a API não estiver disponível
        console.log('Usando dados mockados para localizações');
        setLocations(mockLocations);
        setFilteredLocations(mockLocations);
      }
    };

    fetchData();
  }, []);

  // Foco automático no Brasil
  useEffect(() => {
    if (globeRef.current) {
      // Coordenadas aproximadas do Brasil
      globeRef.current.pointOfView({ lat: -14.235, lng: -51.9253, altitude: 2.5 });
    }
  }, []);

  // Função para determinar a cor dos pontos com base no país e estado de hover
  const getPointColor = (d: Location) => {
    if (d.id === hoveredId) return '#22c55e'; // Verde quando hover
    
    // Países que queremos destacar
    const highlightedCountries = ['Brasil', 'Brazil', 'Suriname', 'Guiana', 'Venezuela', 'França', 'France', 'Guiana Francesa', 'French Guiana'];
    
    return highlightedCountries.includes(d.country) ? '#eab308' : '#3b82f6';
  };

  // Função para filtrar localizações
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        location => 
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);

  // Função para zoom
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

  useEffect(() => {
    if (globeRef.current) {
      // Evento para detectar quando o globo estiver pronto
      globeRef.current.renderer()?.domElement.addEventListener('globeready', () => {
        setGlobeReady(true);
      });
    }
  }, [globeRef.current]);

  // Função para navegar para a página de detalhes
  const handleLocationClick = (locationId: number) => {
    navigate(`/location/${locationId}`);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Sidebar />
      
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
          
          // Configuração do Globe - usando OpenStreetMap
          globeImageUrl={null}
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          globeTileEngineUrl={(x: number, y: number, z: number) => `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`}
          
          // Configurações básicas
          enablePointerInteraction={true}
          animateIn={true}
          waitForGlobeReady={true}
          atmosphereColor="#1e293b"
          atmosphereAltitude={0.15}
          
          // Configuração dos marcadores HTML
          htmlElementsData={filteredLocations}
          htmlLat={(d: Location) => d.latitude}
          htmlLng={(d: Location) => d.longitude}
          htmlAltitude={0}
          htmlTransitionDuration={0}
          htmlElement={(d: Location) => {
            const el = document.createElement('div');
            
            el.innerHTML = `
              <div style="
                transform: translate(-50%, -100%) scale(${d.id === hoveredId ? 1.2 : 1});
                position: relative;
                width: 28px;
                height: 42px;
                cursor: pointer;
                pointer-events: auto;
                transition: all 0.2s ease;
              ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z" 
                    fill="${getPointColor(d)}" />
                  <circle cx="12" cy="12" r="6" fill="white" />
                </svg>
              </div>
            `;
            
            // Adicionar evento de hover
            el.onmouseover = () => {
              setHoverInfo({
                ...d,
                lat: Number(d.latitude),
                lng: Number(d.longitude)
              });
              setHoveredId(d.id);
            };
            
            el.onmouseout = () => {
              setHoverInfo(null);
              setHoveredId(null);
            };
            
            // Modificar o evento de clique para navegar para a página de detalhes
            el.onclick = () => {
              if (globeRef.current) {
                globeRef.current.pointOfView({ 
                  lat: d.latitude, 
                  lng: d.longitude, 
                  altitude: 1.2
                }, 500);
                
                // Aguardar a animação do globo antes de navegar
                setTimeout(() => {
                  handleLocationClick(d.id);
                }, 600);
              }
            };
            
            return el;
          }}
          
          // Remover pointsData para evitar duplicação
          pointsData={[]}
          onGlobeReady={() => setGlobeReady(true)}
        />
      </div>

      {/* Controles do mapa */}
      <div className="fixed left-4 bottom-4 z-10 flex flex-col gap-2">
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

      {/* Cards laterais */}
      <div className="fixed right-0 top-0 bottom-0 w-72 flex items-center justify-center pointer-events-none z-10">
        <div className="w-full h-[80vh] flex flex-col gap-3 px-4">
          {/* Card Superior - Cidades */}
          <div className="h-[45%] bg-black/50 backdrop-blur-sm rounded-lg p-3 pointer-events-auto border border-white/10">
            <h2 className="text-base font-semibold mb-2 text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Cidades em foco
            </h2>
            
            <div className="h-[calc(100%-2rem)] overflow-y-auto pr-1">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className={`flex items-center gap-2 py-1 px-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                    location.id === hoveredId 
                      ? 'bg-white/20 scale-105' 
                      : 'hover:bg-white/10'
                  }`}
                  onMouseEnter={() => {
                    setHoverInfo({
                      ...location,
                      lat: Number(location.latitude),
                      lng: Number(location.longitude)
                    });
                    setHoveredId(location.id);
                  }}
                  onMouseLeave={() => {
                    setHoverInfo(null);
                    setHoveredId(null);
                  }}
                  onClick={() => {
                    if (globeRef.current) {
                      globeRef.current.pointOfView({ 
                        lat: location.latitude, 
                        lng: location.longitude, 
                        altitude: 1.5 
                      }, 500);
                      
                      // Aguardar a animação do globo antes de navegar
                      setTimeout(() => {
                        handleLocationClick(location.id);
                      }, 600);
                    }
                  }}
                >
                  <div className={`w-6 h-6 ${
                    location.id === hoveredId
                      ? 'bg-green-500/50'
                      : getPointColor(location) === '#eab308' 
                        ? 'bg-yellow-500/50' 
                        : 'bg-blue-500/50'
                  } rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-200`}>
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white text-sm font-medium truncate">{location.name}</h3>
                    <p className="text-white/60 text-xs truncate">{location.country}</p>
                  </div>
                </div>
              ))}
              
              {filteredLocations.length === 0 && (
                <div className="text-white/70 text-sm py-2 text-center">
                  Nenhuma localização encontrada
                </div>
              )}
            </div>
          </div>

          {/* Card Inferior - Informações */}
          <div className="h-[55%] bg-black/50 backdrop-blur-sm rounded-lg p-4 pointer-events-auto border border-white/10">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <GlobeIcon className="w-5 h-5" />
              Informações
            </h2>
            <div className="mt-2 h-[calc(100%-3rem)] overflow-y-auto">
              {hoverInfo ? (
                <div className="text-white">
                  <p className="font-medium text-base">{hoverInfo.name}</p>
                  <p className="text-sm text-white/80">{hoverInfo.country}</p>
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-white/70">Coordenadas:</p>
                    <p className="text-xs font-mono">
                      {typeof hoverInfo.lat === 'number' ? hoverInfo.lat.toFixed(4) : hoverInfo.latitude.toFixed(4)}°, 
                      {typeof hoverInfo.lng === 'number' ? hoverInfo.lng.toFixed(4) : hoverInfo.longitude.toFixed(4)}°
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-white/80">
                  <p className="mb-2">Mapa interativo mostrando as localizações importantes para o projeto.</p>

                  <div className="mt-3 pt-2 border-t border-white/10">
                    <ul className="list-disc pl-4 text-xs text-white/70 space-y-1">
                      <li>Passe o mouse sobre as cidades para ver detalhes</li>
                      <li>Clique nas cidades à direita para navegar até elas</li>
                      <li>Use os controles à esquerda para zoom</li>
                      <li>Arraste para girar o globo</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;