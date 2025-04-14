import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import axios from 'axios';
import { MapPin, Search, ZoomIn, ZoomOut, Globe as GlobeIcon, RotateCcw, Loader2, Thermometer, Cloud, CloudRain, Sun, CloudSun } from 'lucide-react';
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

interface WeatherData {
  locationId: number;
  city: string;
  temperature: number;
  condition: string;
  icon: string;
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Atualizar dimensões e verificar mobile quando a janela for redimensionada
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

  // Carregar dados das localizações e o clima
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar localizações
        const locationsResponse = await axios.get('http://localhost:3000/api/locations');
        setLocations(locationsResponse.data);
        setFilteredLocations(locationsResponse.data);
        
        // Buscar dados de clima depois das localizações carregarem
        fetchWeatherData(locationsResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        // Usar dados mockados se a API não estiver disponível
        console.log('Usando dados mockados para localizações');
        setLocations(mockLocations);
        setFilteredLocations(mockLocations);
        
        // Buscar clima para os dados mockados
        fetchWeatherData(mockLocations);
      }
    };

    fetchData();
    
    // Iniciar carrossel automático
    const interval = setInterval(() => {
      setCarouselIndex(prevIndex => {
        return weatherData.length > 0 ? (prevIndex + 1) % weatherData.length : 0;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Avançar carrossel quando weatherData mudar
  useEffect(() => {
    if (weatherData.length > 0) {
      setCarouselIndex(0);
    }
  }, [weatherData]);

  // Buscar dados de clima para as localizações
  const fetchWeatherData = async (locations: Location[]) => {
    setLoadingWeather(true);
    
    try {
      // Limitar a 10 localizações para não sobrecarregar a API
      const locationsToFetch = locations.slice(0, 10);
      const weatherDataPromises = locationsToFetch.map(async (location) => {
        try {
          // Use a API OpenWeatherMap (você precisará criar uma conta e obter uma chave API)
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`, {
              params: {
                lat: location.latitude,
                lon: location.longitude,
                units: 'metric', // para Celsius
                appid: '08854d15b68d2d5b0feb2727a1a61d55' // Substitua pela sua chave API
              }
            }
          );
          
          return {
            locationId: location.id,
            city: location.name,
            temperature: Math.round(weatherResponse.data.main.temp),
            condition: weatherResponse.data.weather[0].main,
            icon: weatherResponse.data.weather[0].icon
          } as WeatherData;
        } catch (error) {
          console.error(`Erro ao buscar clima para ${location.name}:`, error);
          // Retornar dados fictícios em caso de erro
          return {
            locationId: location.id,
            city: location.name,
            temperature: Math.floor(Math.random() * 30 + 5), // Temperatura aleatória entre 5 e 35°C
            condition: ['Clear', 'Clouds', 'Rain', 'Thunderstorm'][Math.floor(Math.random() * 4)],
            icon: '01d'
          } as WeatherData;
        }
      });
      
      const fetchedWeatherData = await Promise.all(weatherDataPromises);
      setWeatherData(fetchedWeatherData);
    } catch (error) {
      console.error('Erro ao buscar dados de clima:', error);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Foco automático no Brasil
  useEffect(() => {
    if (globeRef.current) {
      // Coordenadas aproximadas do Brasil com zoom mais próximo
      globeRef.current.pointOfView({ lat: -14.235, lng: -51.9253, altitude: 1 });
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
        altitude: 1.5 
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

  // Função para obter o ícone de clima
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-6 h-6 text-yellow-400" />;
      case 'clouds':
        return <CloudSun className="w-6 h-6 text-gray-400" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'thunderstorm':
        return <Cloud className="w-6 h-6 text-gray-600" />;
      default:
        return <CloudSun className="w-6 h-6 text-gray-400" />;
    }
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
            
            // Tamanho menor do pin em dispositivos móveis
            const pinWidth = isMobile ? "20" : "28";
            const pinHeight = isMobile ? "30" : "42";
            
            el.innerHTML = `
              <div style="
                transform: translate(-50%, -100%) scale(${d.id === hoveredId ? 1.2 : 1});
                position: relative;
                width: ${pinWidth}px;
                height: ${pinHeight}px;
                cursor: pointer;
                pointer-events: auto;
                transition: all 0.2s ease;
              ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="${pinWidth}" height="${pinHeight}">
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

      {/* Controles do mapa - Ajustado para mobile */}
      <div className="fixed left-4 bottom-4 md:left-4 md:bottom-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => handleZoom('in')}
          className="w-8 h-8 md:w-10 md:h-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
        >
          <ZoomIn className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="w-8 h-8 md:w-10 md:h-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
        >
          <ZoomOut className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </button>
        <button
          onClick={resetView}
          className="w-8 h-8 md:w-10 md:h-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
        >
          <RotateCcw className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {/* Barra de pesquisa em mobile */}
      <div className="fixed top-0 left-0 right-0 p-2 z-20 md:hidden">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar cidade ou país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/60 backdrop-blur-sm text-white placeholder-white/50 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
        </div>
      </div>

      {/* Cards - Responsivo */}
      <div className="fixed md:right-0 bottom-0 md:top-0 md:bottom-0 w-full md:w-72 flex md:flex-col items-end md:items-center justify-center pointer-events-none z-10">
        <div className="w-full md:h-[80vh] flex flex-col-reverse md:flex-col gap-2 md:gap-3 px-2 md:px-4">
          
          {/* Card Superior - Cidades */}
          <div className="relative md:static flex flex-col md:h-[45%] bg-black/50 backdrop-blur-sm rounded-lg pointer-events-auto border border-white/10 mb-16 md:mb-0">
            <div className="md:hidden absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full p-1 border border-white/10">
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                onClick={() => {
                  const container = document.getElementById('cities-container');
                  if (container) {
                    container.classList.toggle('h-0');
                    container.classList.toggle('h-64');
                  }
                }}
              >
                <MapPin className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="p-3 flex flex-col h-full">
              <h2 className="text-base font-semibold mb-2 text-white flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Cidades em foco
              </h2>
              
              <div id="cities-container" className="h-64 md:h-full overflow-y-auto pr-1 transition-all duration-300 flex-grow">
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
                    <div className={`w-5 h-5 md:w-6 md:h-6 ${
                      location.id === hoveredId
                        ? 'bg-green-500/50'
                        : getPointColor(location) === '#eab308' 
                          ? 'bg-yellow-500/50' 
                          : 'bg-blue-500/50'
                    } rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-200`}>
                      <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white text-xs md:text-sm font-medium truncate">{location.name}</h3>
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
          </div>

          {/* Card Inferior - Informações */}
          <div className="flex flex-col md:h-[45%] bg-black/50 backdrop-blur-sm rounded-lg p-3 md:p-4 pointer-events-auto border border-white/10 mb-2 md:mb-3">
            <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
              <GlobeIcon className="w-4 h-4 md:w-5 md:h-5" />
              Informações
            </h2>
            <div className="mt-1 md:mt-2 overflow-y-auto flex-grow">
              {hoverInfo ? (
                <div className="text-white">
                  <p className="font-medium text-sm md:text-base">{hoverInfo.name}</p>
                  <p className="text-xs md:text-sm text-white/80">{hoverInfo.country}</p>
                  <div className="mt-1 md:mt-2 pt-1 md:pt-2 border-t border-white/10">
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
                      <li>Clique nas cidades para navegar até elas</li>
                      <li>Arraste para girar o globo</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Carrossel do clima - fixo na parte inferior, ao lado do sidebar */}
      <div className="fixed bottom-6 left-0 right-0 z-20 pointer-events-auto md:left-56">
        <div className="mx-4 md:mx-6 md:mr-6">
          <div className="rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm border border-white/10 shadow-lg">
            {loadingWeather ? (
              <div className="h-16 flex items-center justify-center text-white px-4">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Carregando clima...</span>
              </div>
            ) : weatherData.length > 0 ? (
              <div className="relative w-full">
                <div className="flex items-center overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 w-full"
                    style={{ 
                      transform: `translateX(-${Math.floor(carouselIndex / 3) * 100}%)` 
                    }}
                  >
                    {/* Agrupar cidades em slides de 3 */}
                    {Array.from({ length: Math.ceil(weatherData.length / 3) }).map((_, slideIndex) => (
                      <div key={slideIndex} className="flex-shrink-0 w-full flex">
                        {weatherData.slice(slideIndex * 3, slideIndex * 3 + 3).map((weather) => (
                          <div 
                            key={weather.locationId} 
                            className={`flex-1 min-w-0 flex items-center justify-between px-3 py-3 border-r border-gray-700/30 last:border-r-0 ${
                              carouselIndex === weatherData.indexOf(weather) ? 'bg-gray-800/30' : ''
                            }`}
                            onClick={() => setCarouselIndex(weatherData.indexOf(weather))}
                          >
                            <div className="flex items-center min-w-0">
                              <div className="bg-gray-800/50 p-2 rounded-full flex-shrink-0">
                                {getWeatherIcon(weather.condition)}
                              </div>
                              <div className="ml-2 min-w-0">
                                <h3 className="text-white font-medium text-sm md:text-base truncate">{weather.city}</h3>
                                <p className="text-white/70 text-xs truncate">{weather.condition}</p>
                              </div>
                            </div>
                            <div className="flex items-center flex-shrink-0 ml-2">
                              <Thermometer className="w-5 h-5 text-red-400 mr-1" />
                              <span className="text-white font-bold text-lg">{weather.temperature}°C</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controles de navegação */}
                <div className="absolute top-0 bottom-0 w-full flex justify-between items-center">
                  <button 
                    className="h-full px-2 text-white/40 hover:text-white/80 hover:bg-black/20 focus:outline-none"
                    onClick={() => {
                      const prevSlideIndex = Math.floor(carouselIndex / 3) - 1;
                      const newSlideIndex = prevSlideIndex < 0 
                        ? Math.ceil(weatherData.length / 3) - 1 
                        : prevSlideIndex;
                      setCarouselIndex(newSlideIndex * 3);
                    }}
                  >
                    ‹
                  </button>
                  <button 
                    className="h-full px-2 text-white/40 hover:text-white/80 hover:bg-black/20 focus:outline-none"
                    onClick={() => {
                      const nextSlideIndex = (Math.floor(carouselIndex / 3) + 1) % Math.ceil(weatherData.length / 3);
                      setCarouselIndex(nextSlideIndex * 3);
                    }}
                  >
                    ›
                  </button>
                </div>

                {/* Indicadores do carrossel */}
                <div className="absolute bottom-0 w-full flex justify-center pb-1">
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.ceil(weatherData.length / 3) }).map((_, index) => (
                      <button
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          Math.floor(carouselIndex / 3) === index ? 'bg-white' : 'bg-white/30'
                        }`}
                        onClick={() => setCarouselIndex(index * 3)}
                        aria-label={`Ver slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-16 flex items-center justify-center text-white/70 px-4">
                <span className="text-sm">Dados climáticos indisponíveis</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;