import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Search, Loader2, Thermometer, Cloud, CloudRain, Sun, CloudSun, Globe as GlobeIcon } from 'lucide-react';
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
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [isMapReady, setMapReady] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Atualizar dimensões e verificar mobile quando a janela for redimensionada
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Controlar quando o iframe estiver carregado
  const handleIframeLoad = () => {
    setMapReady(true);
  };

  // Carregar dados do clima
  useEffect(() => {
    const mockWeatherData: WeatherData[] = [
      {
        locationId: 1,
        city: "Oiapoque",
        temperature: 28,
        condition: "Clouds",
        icon: "04d"
      },
      {
        locationId: 2,
        city: "Saint-Georges",
        temperature: 27,
        condition: "Clear",
        icon: "01d"
      },
      {
        locationId: 3,
        city: "Lethem",
        temperature: 29,
        condition: "Rain",
        icon: "10d"
      },
      {
        locationId: 4,
        city: "Bonfim",
        temperature: 30,
        condition: "Clear",
        icon: "01d"
      },
      {
        locationId: 5,
        city: "Albina",
        temperature: 27,
        condition: "Clouds",
        icon: "04d"
      },
      {
        locationId: 6,
        city: "Saint Laurent du Maroni",
        temperature: 26,
        condition: "Rain",
        icon: "10d"
      },
      {
        locationId: 7,
        city: "Santa Elena do Uairen",
        temperature: 24,
        condition: "Clouds",
        icon: "04d"
      },
      {
        locationId: 8,
        city: "Pacaraima",
        temperature: 23,
        condition: "Clear",
        icon: "01d"
      },
      {
        locationId: 9,
        city: "Nieuw Nickerie",
        temperature: 28,
        condition: "Clouds",
        icon: "04d"
      },
      {
        locationId: 10,
        city: "Corriverton",
        temperature: 29,
        condition: "Clear",
        icon: "01d"
      }
    ];

    setWeatherData(mockWeatherData);
    setLoadingWeather(false);

    // Iniciar carrossel automático
    const interval = setInterval(() => {
      setCarouselIndex(prevIndex => {
        return mockWeatherData.length > 0 ? (prevIndex + 1) % mockWeatherData.length : 0;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

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
      
      {/* Mapa Cesium via iframe */}
      <div className="absolute inset-0">
        {!isMapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-slate-900/80">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg text-white">Carregando o mapa...</p>
          </div>
        )}
        <iframe 
          ref={iframeRef}
          title="PIT-T Cesium Map" 
          className="w-full h-full border-0" 
          src="https://ion.cesium.com/stories/viewer/?id=66b754b4-d6f3-4100-8366-5acaddd0962d" 
          frameBorder="0" 
          allowFullScreen={true}
          onLoad={handleIframeLoad}
          allow="fullscreen"
        />
      </div>

      {/* Barra de pesquisa em mobile */}
      <div className="fixed top-0 left-0 right-0 p-2 z-20 md:hidden">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar cidade ou país..."
            value={hoverInfo?.name}
            onChange={(e) => setHoverInfo({ ...hoverInfo, name: e.target.value })}
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
                <div
                  className="flex items-center gap-2 py-1 px-1.5 rounded-md transition-all duration-200 cursor-pointer hover:bg-white/10"
                  onMouseEnter={() => {
                    setHoverInfo({
                      name: "Oiapoque",
                      twin_city: "Saint-Georges",
                      country: "Brasil",
                      lat: 3.8404,
                      lng: -51.8433
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverInfo(null);
                  }}
                  onClick={() => navigate('/location/1')}
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-yellow-500/50 rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                    <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white text-xs md:text-sm font-medium truncate">Oiapoque - Saint-Georges</h3>
                    <p className="text-white/60 text-xs truncate">Brasil - Guiana Francesa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Inferior - Informações */}
          <div className="flex flex-col md:h-[45%] bg-black/50 backdrop-blur-sm rounded-lg p-3 md:p-4 pointer-events-auto border border-white/10 mb-2 md:mb-3">
            <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
              <GlobeIcon className="w-4 h-4 md:w-5 md:h-5" />
              Informações <span className="text-xs ml-2 bg-blue-500 px-1.5 py-0.5 rounded-full">Cesium</span>
            </h2>
            <div className="mt-1 md:mt-2 overflow-y-auto flex-grow">
              {hoverInfo ? (
                <div className="text-white">
                  <p className="font-medium text-sm md:text-base">Oiapoque - Saint-Georges</p>
                  <p className="text-xs md:text-sm text-white/80">Brasil - Guiana Francesa</p>
                  <div className="mt-3 text-sm text-white/90 leading-relaxed">
                    Separadas pelo rio Oiapoque, as cidades gêmeas Oiapoque (AP) e Saint-Georges (Guiana Francesa) unem Brasil e Europa na fronteira amazônica. 
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/70">Coordenadas:</p>
                    <p className="text-xs font-mono">
                      3.8404°, -51.8433°
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-white/80">
                  <p className="mb-2">Passe o mouse sobre a cidade para ver mais informações sobre as cidades gêmeas.</p>

                  <div className="mt-3 pt-2 border-t border-white/10">
                    <ul className="list-disc pl-4 text-xs text-white/70 space-y-1">
                      <li>Clique na cidade para ver dados detalhados</li>
                      <li>Arraste para girar o globo</li>
                      <li>Use o scroll para zoom</li>
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