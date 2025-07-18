import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, GeoJSON } from 'react-leaflet';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, Loader2, Menu, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Sidebar from '../components/layout/Sidebar';
import api from '../services/api';
import logoPitt from '../images/logo-potedes.png';
import { kml } from '@tmcw/togeojson';

// Corrigir ícones do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.divIcon({
  html: `<div style="
    background-color: #feca57;
    width: 25px;
    height: 25px;
    border-radius: 50% 50% 50% 0;
    border: 3px solid #fff;
    transform: rotate(-45deg);
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [25, 25],
  iconAnchor: [12, 24],
  popupAnchor: [1, -24],
  className: 'custom-div-icon'
});

L.Marker.prototype.options.icon = DefaultIcon;

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

// Componente para controlar o mapa
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    // Validar se as coordenadas são válidas antes de aplicar
    if (center && center.length === 2 && 
        typeof center[0] === 'number' && typeof center[1] === 'number' &&
        !isNaN(center[0]) && !isNaN(center[1]) && 
        isFinite(center[0]) && isFinite(center[1]) &&
        typeof zoom === 'number' && !isNaN(zoom) && isFinite(zoom)) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
};

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [twinCities, setTwinCities] = useState<TwinCity[]>([]);
  const [filteredTwinCities, setFilteredTwinCities] = useState<TwinCity[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-14.235, -51.9253]);
  const [mapZoom, setMapZoom] = useState(4);
  const [countryBorders, setCountryBorders] = useState<any>(null);
  const [pittRegion, setPittRegion] = useState<any>(null);

  // Atualizar dimensões quando a janela for redimensionada
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Carregar dados das cidades gêmeas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/twin-cities');
        setTwinCities(response.data);
        setFilteredTwinCities(response.data);
        console.log('Cidades gêmeas carregadas:', response.data);
      } catch (error) {
        console.error('Erro ao buscar dados das cidades gêmeas:', error);
        setTwinCities([]);
        setFilteredTwinCities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Carregar dados das fronteiras dos países
  useEffect(() => {
    const fetchCountryBorders = async () => {
      try {
        // Usar uma API pública que fornece fronteiras dos países em GeoJSON
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const geojsonData = await response.json();
        setCountryBorders(geojsonData);
        console.log('Fronteiras dos países carregadas');
      } catch (error) {
        console.error('Erro ao carregar fronteiras dos países:', error);
      }
    };

    fetchCountryBorders();
  }, []);

  // Carregar dados da região PIT-T do arquivo KML
  useEffect(() => {
    const fetchPittRegion = async () => {
      try {
        // Carregar o arquivo KML
        const response = await fetch('/pitt.kml');
        const kmlText = await response.text();
        
        // Converter KML para GeoJSON
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
        const geojsonData = kml(kmlDoc);
        
        setPittRegion(geojsonData);
        console.log('Região PIT-T carregada:', geojsonData);
      } catch (error) {
        console.error('Erro ao carregar região PIT-T:', error);
      }
    };

    fetchPittRegion();
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

  // Estilo para as fronteiras dos países
  const countryStyle = {
    fillColor: 'transparent',
    weight: 2,
    opacity: 0.8,
    color: '#ffffff',
    dashArray: '3',
    fillOpacity: 0,
    interactive: false,
    bubblingMouseEvents: false
  };

  // Estilo para a região PIT-T (contorno amarelo)
  const pittRegionStyle = {
    fillColor: '#ffd700', // Amarelo dourado
    weight: 4,
    opacity: 1,
    color: '#ffd700', // Contorno amarelo
    fillOpacity: 0.1,
    interactive: false,
    bubblingMouseEvents: false
  };

  // Função para remover completamente todos os efeitos de interação
  const onEachCountry = (feature: any, layer: any) => {
    // Remover completamente todos os eventos de interação
    layer.off(); // Remove todos os event listeners
    
    // Desabilitar interatividade completamente
    layer.options.interactive = false;
    
    // Remover eventos específicos se existirem
    layer.on({
      click: (e: any) => {
        // Prevenir propagação do evento
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
        return false;
      },
      mouseover: () => false,
      mouseout: () => false,
      contextmenu: () => false,
      dblclick: () => false
    });

    // Garantir que nenhum popup ou tooltip seja criado
    layer.unbindPopup();
    layer.unbindTooltip();
  };

  // Função para processar a região PIT-T
  const onEachPittRegion = (feature: any, layer: any) => {
    // Adicionar tooltip com nome da região
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, {
        permanent: false,
        direction: 'center',
        className: 'pitt-region-tooltip'
      });
    }
  };

  // Funções para controle do mapa
  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 2));
  };

  const resetView = () => {
    setMapCenter([-14.235, -51.9253]);
    setMapZoom(4);
  };

  // Função para navegar para a página de detalhes
  const handleLocationClick = (locationId: number) => {
    navigate(`/location/${locationId}`);
  };

  // Função para alternar a visibilidade da sidebar no mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
      sidebarElement.classList.toggle('sidebar-open');
    }
  };

  // Função para focar em uma cidade
  const focusOnCity = (city: TwinCity) => {
    // Converter e validar coordenadas
    const latA = parseFloat(String(city.cityA_latitude));
    const lngA = parseFloat(String(city.cityA_longitude));
    const latB = parseFloat(String(city.cityB_latitude));
    const lngB = parseFloat(String(city.cityB_longitude));
    
    const midLat = (latA + latB) / 2;
    const midLng = (lngA + lngB) / 2;
    
    // Verificar se as coordenadas calculadas são válidas
    if (!isNaN(midLat) && !isNaN(midLng) && isFinite(midLat) && isFinite(midLng)) {
      setMapCenter([midLat, midLng]);
      setMapZoom(8);
      
      // Aguardar a animação antes de navegar
      setTimeout(() => {
        handleLocationClick(city.id);
      }, 1000);
    } else {
      // Se as coordenadas são inválidas, navegar diretamente sem animar o mapa
      console.warn('Coordenadas inválidas para a cidade:', city);
      handleLocationClick(city.id);
    }
  };

  // Criar marcadores para cada cidade do par
  const createMarkers = () => {
    const markers: JSX.Element[] = [];
    
    filteredTwinCities.forEach((city) => {
      // Converter e validar coordenadas
      const latA = parseFloat(String(city.cityA_latitude));
      const lngA = parseFloat(String(city.cityA_longitude));
      const latB = parseFloat(String(city.cityB_latitude));
      const lngB = parseFloat(String(city.cityB_longitude));
      
      // Marcador para Cidade A (apenas se as coordenadas forem válidas)
      if (!isNaN(latA) && !isNaN(lngA)) {
        markers.push(
          <Marker
            key={`${city.id}-A`}
            position={[latA, lngA]}
          icon={hoveredId === city.id ? 
            L.divIcon({
              html: `<div style="
                background-color: #54a0ff;
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                border: 3px solid #fff;
                transform: rotate(-45deg);
                box-shadow: 0 2px 5px rgba(0,0,0,0.4);
              "></div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [1, -30],
              className: 'custom-div-icon'
            }) : DefaultIcon
          }
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{city.cityA_name}</h3>
              <p className="text-sm text-gray-600">
                Cidade gêmea: {city.cityB_name}
              </p>
              {city.description && (
                <p className="text-sm mt-2">{city.description}</p>
              )}
              <button
                onClick={() => handleLocationClick(city.id)}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Ver detalhes
              </button>
            </div>
          </Popup>
        </Marker>
        );
      }

      // Marcador para Cidade B (apenas se as coordenadas forem válidas)
      if (!isNaN(latB) && !isNaN(lngB)) {
        markers.push(
          <Marker
            key={`${city.id}-B`}
            position={[latB, lngB]}
          icon={hoveredId === city.id ? 
            L.divIcon({
              html: `<div style="
                background-color: #54a0ff;
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                border: 3px solid #fff;
                transform: rotate(-45deg);
                box-shadow: 0 2px 5px rgba(0,0,0,0.4);
              "></div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [1, -30],
              className: 'custom-div-icon'
            }) : DefaultIcon
          }
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{city.cityB_name}</h3>
              <p className="text-sm text-gray-600">
                Cidade gêmea: {city.cityA_name}
              </p>
              {city.description && (
                <p className="text-sm mt-2">{city.description}</p>
              )}
              <button
                onClick={() => handleLocationClick(city.id)}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Ver detalhes
              </button>
            </div>
          </Popup>
        </Marker>
        );
      }
    });
    
    return markers;
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Sidebar />
      
      {/* Overlay para quando o sidebar estiver aberto no mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Container do mapa */}
      <div className="absolute inset-0">
        {isLoading && (
          <div className="flex flex-col items-center justify-center z-[1001] bg-slate-900/80 w-full h-full absolute">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg text-white mb-2">Carregando o mapa...</p>
            <p className="text-sm text-white/60">Buscando cidades gêmeas...</p>
          </div>
        )}
        
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <LayersControl position="topright">
            {/* Camada de Satélite - Padrão */}
            <LayersControl.BaseLayer checked name="Satélite">
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
            
            {/* Camada Híbrida (Satélite + Labels) */}
            <LayersControl.BaseLayer name="Híbrido">
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
            
            {/* Camada de Ruas (OpenStreetMap) */}
            <LayersControl.BaseLayer name="Ruas">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
            
            {/* Camada Topográfica */}
            <LayersControl.BaseLayer name="Topográfico">
              <TileLayer
                attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                maxZoom={17}
              />
            </LayersControl.BaseLayer>
            
            {/* Overlay: Fronteiras dos Países */}
            <LayersControl.Overlay checked name="Fronteiras dos Países">
              {countryBorders && (
                <GeoJSON
                  data={countryBorders}
                  style={countryStyle}
                  onEachFeature={onEachCountry}
                  interactive={false}
                  bubblingMouseEvents={false}
                />
              )}
            </LayersControl.Overlay>
            
            {/* Overlay: Região PIT-T */}
            <LayersControl.Overlay checked name="Região das Guianas (PIT-T)">
              {pittRegion && (
                <GeoJSON
                  data={pittRegion}
                  style={pittRegionStyle}
                  onEachFeature={onEachPittRegion}
                />
              )}
            </LayersControl.Overlay>
          </LayersControl>
          
          <MapController center={mapCenter} zoom={mapZoom} />
          {createMarkers()}
        </MapContainer>
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
      <div className="fixed md:right-4 bottom-0 md:bottom-auto md:top-1/2 md:transform md:-translate-y-1/2 w-full md:w-72 flex md:flex-col items-center justify-center pointer-events-none z-[1000]">
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
                    onMouseEnter={() => setHoveredId(city.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => focusOnCity(city)}
                  >
                    <div 
                      className="w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{
                        backgroundColor: city.id === hoveredId
                          ? '#54a0ff'  // Azul quando hover
                          : '#feca57'  // Amarelo
                      }}
                    >
                      <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-black" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white text-xs md:text-sm font-medium truncate">{city.cityA_name} - {city.cityB_name}</h3>
                    </div>
                  </div>
                ))}
                
                {filteredTwinCities.length === 0 && !isLoading && (
                  <div className="text-white/70 text-sm py-2 text-center">
                    {t('noTwinCitiesFound')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles do mapa */}
      <div className="fixed left-4 top-20 md:top-auto md:bottom-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
        >
          <ZoomIn className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={handleZoomOut}
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

// Adicionar estilos CSS para o tooltip da região PIT-T
const styleElement = document.createElement('style');
styleElement.textContent = `
  .pitt-region-tooltip {
    background-color: rgba(255, 215, 0, 0.9) !important;
    color: #000 !important;
    border: 2px solid #ffd700 !important;
    border-radius: 6px !important;
    font-size: 14px !important;
    font-weight: bold !important;
    padding: 6px 12px !important;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4) !important;
  }
  .pitt-region-tooltip::before {
    border-top-color: rgba(255, 215, 0, 0.9) !important;
  }
`;
if (!document.head.querySelector('style[data-pitt-tooltips]')) {
  styleElement.setAttribute('data-pitt-tooltips', 'true');
  document.head.appendChild(styleElement);
}

export default Home;
