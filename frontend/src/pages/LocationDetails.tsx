import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, TrendingUp, GraduationCap, Leaf, Building, DollarSign, BarChart, Percent, Heart, Droplet, Syringe, Activity, Users as UsersIcon, Thermometer, Book, FileText, File, MoreHorizontal, AlertCircle, Globe, Axe, Recycle, Pickaxe } from 'lucide-react';
import axios from 'axios';
import Saude from '../images/saude2.png'
import Populacao from '../images/populacao2.png'
import Socioeconomico from '../images/socioeconomico2.png'
import Educacao from '../images/educacao2.png'
import Ambiente from '../images/ambiente2.png'
import Ponte from '../images/ponte.jpg'
import Oiapoque from '../images/oiapoque.jpg'
import SaintGeorges from '../images/saintgeorge.jpg'

interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  country: string;
  image_url?: string;
  twin_city?: string;
}

interface Indicator {
  id: number;
  location_id: number;
  category: string; // saude, populacao, desenvolvimento, educacao, meio_ambiente
  title: string;
  value: string;
  unit?: string;
  description?: string;
}

interface HealthIndicator {
  id: number;
  title: string;
  oiapoque: {
    value: string;
    unit: string;
  };
  saintGeorges: {
    value: string;
    unit: string;
  };
  description?: string;
  icon?: React.ComponentType<any>;
}

interface PopulationIndicator {
  id: number;
  title: string;
  oiapoque: {
    value: string;
    unit: string;
  };
  saintGeorges: {
    value: string;
    unit: string;
  };
  description?: string;
  icon?: React.ComponentType<any>;
}

interface DevelopmentIndicator {
  id: number;
  title: string;
  oiapoque: {
    value: string;
    unit: string;
  };
  saintGeorges: {
    value: string;
    unit: string;
  };
  description?: string;
  icon?: React.ComponentType<any>;
}

interface GalleryImage {
  url: string;
  alt: string;
}

interface Gallery {
  id: number;
  title: string;
  description: string;
  images: GalleryImage[];
}

// Estilos para animações
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  @keyframes float-medium {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  .animate-float-slow {
    animation: float-slow 6s ease-in-out infinite;
  }
  .animate-float-medium {
    animation: float-medium 5s ease-in-out infinite;
  }
`;

const LocationDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [healthIndicators, setHealthIndicators] = useState<HealthIndicator[]>([]);
  const [activeCategory, setActiveCategory] = useState('saude');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('livros');
  const [digitalCollection, setDigitalCollection] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [populationIndicators, setPopulationIndicators] = useState<PopulationIndicator[]>([]);
  const [developmentIndicators, setDevelopmentIndicators] = useState<DevelopmentIndicator[]>([]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        const [locationResponse, indicatorsResponse, collectionResponse, galleriesResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/locations/${id}`),
          axios.get(`http://localhost:3000/api/indicators?location_id=${id}`),
          axios.get(`http://localhost:3000/api/digital-collection?location_id=${id}`),
          axios.get(`http://localhost:3000/api/galleries?location_id=${id}`)
        ]);

        console.log('Digital Collection Response:', collectionResponse.data);

        setLocation(locationResponse.data);
        const locationIndicators = indicatorsResponse.data.filter(
          (indicator: Indicator) => indicator.location_id === Number(id)
        );
        setIndicators(locationIndicators);
        setDigitalCollection(collectionResponse.data);
        setGalleries(galleriesResponse.data);
        
        // Conjunto de dados mockados para indicadores de saúde comparativos
        setHealthIndicators([
          {
            id: 1,
            title: "Taxa de Mortalidade Infantil",
            oiapoque: {
              value: "14.2",
              unit: "por mil nascidos vivos"
            },
            saintGeorges: {
              value: "8.4",
              unit: "por mil nascidos vivos"
            },
            description: "Dados de 2018-2022",
            icon: Thermometer
          },
          {
            id: 2,
            title: "Leitos Hospitalares Disponíveis",
            oiapoque: {
              value: "2.3",
              unit: "por 1000 hab."
            },
            saintGeorges: {
              value: "3.5",
              unit: "por 1000 hab."
            },
            icon: Building
          },
          {
            id: 3,
            title: "Cobertura Vacinal",
            oiapoque: {
              value: "78",
              unit: "%"
            },
            saintGeorges: {
              value: "92",
              unit: "%"
            },
            icon: Syringe
          },
          {
            id: 4,
            title: "Acesso a Água",
            oiapoque: {
              value: "82",
              unit: "%"
            },
            saintGeorges: {
              value: "96",
              unit: "%"
            },
            icon: Droplet
          },
          {
            id: 5,
            title: "Expectativa de Vida",
            oiapoque: {
              value: "72.5",
              unit: "anos"
            },
            saintGeorges: {
              value: "76.8",
              unit: "anos"
            },
            description: "Entre 2019 e 2022",
            icon: Activity
          },
          {
            id: 6,
            title: "População Atendida com Esgoto",
            oiapoque: {
              value: "45",
              unit: "%"
            },
            saintGeorges: {
              value: "82",
              unit: "%"
            },
            icon: Droplet
          },
          {
            id: 7,
            title: "Casos de HIV/AIDS",
            oiapoque: {
              value: "32.6",
              unit: "por 100.000 hab."
            },
            saintGeorges: {
              value: "24.8",
              unit: "por 100.000 hab."
            },
            icon: Heart
          },
          {
            id: 8,
            title: "Relação Médico/Habitante",
            oiapoque: {
              value: "1.2",
              unit: "por 1000 hab."
            },
            saintGeorges: {
              value: "2.8",
              unit: "por 1000 hab."
            },
            description: "Dados de 2022",
            icon: UsersIcon
          }
        ]);

        // Conjunto de dados mockados para indicadores populacionais comparativos
        setPopulationIndicators([
          {
            id: 1,
            title: "População Total",
            oiapoque: {
              value: "27.270",
              unit: "mil/hab"
            },
            saintGeorges: {
              value: "4.186",
              unit: "mil/hab"
            },
            description: "Dados de 2020",
            icon: Users
          },
          {
            id: 2,
            title: "Densidade Demográfica",
            oiapoque: {
              value: "1.2",
              unit: "hab/km²"
            },
            saintGeorges: {
              value: "1.45",
              unit: "hab/km²"
            },
            icon: MapPin
          },
          {
            id: 3,
            title: "Taxa de Crescimento",
            oiapoque: {
              value: "1.8",
              unit: "%"
            },
            saintGeorges: {
              value: "0.9",
              unit: "%"
            },
            icon: TrendingUp
          },
          {
            id: 4,
            title: "Taxa de Natalidade",
            oiapoque: {
              value: "15.7",
              unit: "por mil hab"
            },
            saintGeorges: {
              value: "12.3",
              unit: "por mil hab"
            },
            description: "Nascidos vivos por mil hab (2018)",
            icon: Heart
          }
        ]);

        // Conjunto de dados mockados para indicadores de desenvolvimento comparativos
        setDevelopmentIndicators([
          {
            id: 1,
            title: "PIB per capita",
            oiapoque: {
              value: "12.500",
              unit: "R$"
            },
            saintGeorges: {
              value: "15.300",
              unit: "€"
            },
            description: "Dados de 2021",
            icon: DollarSign
          },
          {
            id: 2,
            title: "IDHM",
            oiapoque: {
              value: "0.658",
              unit: ""
            },
            saintGeorges: {
              value: "0.712",
              unit: ""
            },
            description: "Índice de Desenvolvimento Humano Municipal",
            icon: BarChart
          },
          {
            id: 3,
            title: "Taxa de Desemprego",
            oiapoque: {
              value: "12.3",
              unit: "%"
            },
            saintGeorges: {
              value: "8.7",
              unit: "%"
            },
            icon: Users
          },
          {
            id: 4,
            title: "Segurança Pública",
            oiapoque: {
              value: "32.8",
              unit: "ocorrências/mil hab"
            },
            saintGeorges: {
              value: "24.1",
              unit: "ocorrências/mil hab"
            },
            description: "Taxa de criminalidade por mil habitantes",
            icon: AlertCircle
          }
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        
        // Dados mockados para demonstração
        setLocation({
          id: Number(id),
          name: "Oiapoque",
          twin_city: "Saint-Georges",
          description: "Cidade localizada na fronteira do Brasil com a Guiana Francesa",
          latitude: 3.8404,
          longitude: -51.8433,
          country: "Brasil",
          image_url: "/images/oiapoque-bridge.jpg"
        });
        
        setIndicators([
          // Desenvolvimento
          { id: 1, location_id: Number(id), category: "desenvolvimento", title: "PIB per capita", value: "12.500", unit: "R$" },
          { id: 2, location_id: Number(id), category: "desenvolvimento", title: "Taxa de emprego", value: "68", unit: "%" },
          { id: 3, location_id: Number(id), category: "desenvolvimento", title: "Índice de Gini", value: "0.54", unit: "" },
          { id: 4, location_id: Number(id), category: "desenvolvimento", title: "Renda média", value: "1.850", unit: "R$" },
          
          // Saúde
          { id: 5, location_id: Number(id), category: "saude", title: "Expectativa de vida", value: "72.5", unit: "anos" },
          { id: 6, location_id: Number(id), category: "saude", title: "Mortalidade infantil", value: "14.2", unit: "por 1000" },
          { id: 7, location_id: Number(id), category: "saude", title: "Leitos hospitalares", value: "2.3", unit: "por 1000 hab." },
          
          // População
          { id: 8, location_id: Number(id), category: "populacao", title: "Total", value: "27.270", unit: "habitantes" },
          { id: 9, location_id: Number(id), category: "populacao", title: "Densidade", value: "1.2", unit: "hab/km²" },
          { id: 10, location_id: Number(id), category: "populacao", title: "Crescimento anual", value: "1.8", unit: "%" },
          
          // Educação
          { id: 11, location_id: Number(id), category: "educacao", title: "Alfabetização", value: "91.4", unit: "%" },
          { id: 12, location_id: Number(id), category: "educacao", title: "Escolarização", value: "95.2", unit: "%" },
          { id: 13, location_id: Number(id), category: "educacao", title: "Ensino superior", value: "12.6", unit: "%" },
          
          // Meio ambiente
          { id: 14, location_id: Number(id), category: "meio_ambiente", title: "Área verde", value: "68", unit: "%" },
          { id: 15, location_id: Number(id), category: "meio_ambiente", title: "Saneamento", value: "42.7", unit: "%" },
          { id: 16, location_id: Number(id), category: "meio_ambiente", title: "Coleta de resíduos", value: "85.3", unit: "%" }
        ]);
        
        // Conjunto de dados mockados para indicadores de saúde comparativos
        setHealthIndicators([
          {
            id: 1,
            title: "Taxa de Mortalidade Infantil",
            oiapoque: {
              value: "14.2",
              unit: "por mil nascidos vivos"
            },
            saintGeorges: {
              value: "8.4",
              unit: "por mil nascidos vivos"
            },
            description: "Dados de 2018-2022",
            icon: Thermometer
          },
          {
            id: 2,
            title: "Leitos Hospitalares Disponíveis",
            oiapoque: {
              value: "2.3",
              unit: "por 1000 hab."
            },
            saintGeorges: {
              value: "3.5",
              unit: "por 1000 hab."
            },
            icon: Building
          },
          {
            id: 3,
            title: "Cobertura Vacinal",
            oiapoque: {
              value: "78",
              unit: "%"
            },
            saintGeorges: {
              value: "92",
              unit: "%"
            },
            icon: Syringe
          },
          {
            id: 4,
            title: "Acesso a Água",
            oiapoque: {
              value: "82",
              unit: "%"
            },
            saintGeorges: {
              value: "96",
              unit: "%"
            },
            icon: Droplet
          },
          {
            id: 5,
            title: "Expectativa de Vida",
            oiapoque: {
              value: "72.5",
              unit: "anos"
            },
            saintGeorges: {
              value: "76.8",
              unit: "anos"
            },
            description: "Entre 2019 e 2022",
            icon: Activity
          },
          {
            id: 6,
            title: "População Atendida com Esgoto",
            oiapoque: {
              value: "45",
              unit: "%"
            },
            saintGeorges: {
              value: "82",
              unit: "%"
            },
            icon: Droplet
          },
          {
            id: 7,
            title: "Casos de HIV/AIDS",
            oiapoque: {
              value: "32.6",
              unit: "por 100.000 hab."
            },
            saintGeorges: {
              value: "24.8",
              unit: "por 100.000 hab."
            },
            icon: Heart
          },
          {
            id: 8,
            title: "Relação Médico/Habitante",
            oiapoque: {
              value: "1.2",
              unit: "por 1000 hab."
            },
            saintGeorges: {
              value: "2.8",
              unit: "por 1000 hab."
            },
            description: "Dados de 2022",
            icon: UsersIcon
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLocationData();
    }
  }, [id]);

  const categories = [
    { id: 'saude', label: 'Saúde', icon: MapPin },
    { id: 'populacao', label: 'População', icon: Users },
    { id: 'desenvolvimento', label: 'Desenvolvimento', icon: TrendingUp },
    { id: 'educacao', label: 'Educação', icon: GraduationCap },
    { id: 'meio_ambiente', label: 'Meio ambiente', icon: Leaf }
  ];

  const getIconForIndicator = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('pib') || lowerTitle.includes('renda')) return DollarSign;
    if (lowerTitle.includes('taxa') || lowerTitle.includes('índice')) return BarChart;
    if (lowerTitle.includes('percentual') || lowerTitle.includes('%')) return Percent;
    return Building;
  };

  const filteredIndicators = indicators.filter(
    indicator => indicator.category === activeCategory
  );

  const renderCategoryContent = () => {
    if (activeCategory === 'saude') {
    return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-8">
            {/* Título da seção */}
            <h2 className="text-4xl font-bold text-green-800 text-center mb-8">
              Saúde
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative flex justify-center">
              {/* Imagem 3D central */}
              <div className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none">
                <img 
                  src={Saude} 
                  alt="Representação 3D do setor de saúde" 
                  className="h-[550px] object-contain"
                />
              </div>
              
              {/* Grid de cards ao redor da imagem */}
              <div className="grid grid-cols-3 grid-rows-3 gap-5 z-20 w-full max-w-6xl mx-auto">
                {/* Primeira linha */}
                <div className="col-span-1">{renderHealthCard(healthIndicators[0])}</div>
                <div className="col-span-1"></div> {/* Espaço para imagem */}
                <div className="col-span-1">{renderHealthCard(healthIndicators[1])}</div>

                {/* Segunda linha */}
                <div className="col-span-1">{renderHealthCard(healthIndicators[2])}</div>
                <div className="col-span-1"></div> {/* Espaço para imagem */}
                <div className="col-span-1">{renderHealthCard(healthIndicators[3])}</div>

                {/* Terceira linha */}
                <div className="col-span-1">{renderHealthCard(healthIndicators[4])}</div>
                <div className="col-span-1">{renderHealthCard(healthIndicators[5])}</div>
                <div className="col-span-1">{renderHealthCard(healthIndicators[6])}</div>
              </div>
            </div>
          </div>
      </div>
    );
    } else if (activeCategory === 'populacao') {
      // Para depuração
      console.log("Population Indicators:", populationIndicators);

    return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-8">
            {/* Título da seção */}
            <h2 className="text-4xl font-bold text-blue-800 text-center mb-8">
              População
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative h-[600px]">
              {/* Imagem 3D central */}
              <div className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none">
                <img 
                  src={Populacao} 
                  alt="Representação 3D de população" 
                  className="h-[500px] object-contain"
                />
              </div>
              
              {/* Cards posicionados absolutamente com conteúdo direto */}
              <div className="absolute top-0 left-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-blue-800">
                      População Total
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mb-2">Dados de 2020</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mr-1"></div>
                        <span className="text-xs font-medium text-blue-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">
                        27.270<span className="text-xs ml-1 text-blue-600">mil/hab</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mr-1"></div>
                        <span className="text-xs font-medium text-blue-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">
                        4.186<span className="text-xs ml-1 text-blue-600">mil/hab</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-red-100 text-red-700">
                      84.6% maior em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-blue-800">
                      Densidade Demográfica
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mr-1"></div>
                        <span className="text-xs font-medium text-blue-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">
                        1.2<span className="text-xs ml-1 text-blue-600">hab/km²</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mr-1"></div>
                        <span className="text-xs font-medium text-blue-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">
                        1.45<span className="text-xs ml-1 text-blue-600">hab/km²</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-blue-100 text-blue-700">
                      20.8% menor em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-blue-800">
                      Taxa de Crescimento
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mr-1"></div>
                        <span className="text-xs font-medium text-blue-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">
                        1.8<span className="text-xs ml-1 text-blue-600">%</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mr-1"></div>
                        <span className="text-xs font-medium text-blue-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">
                        0.9<span className="text-xs ml-1 text-blue-600">%</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-red-100 text-red-700">
                      50.0% maior em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-blue-800">
                      Taxa de Natalidade
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mb-2">Nascidos vivos por mil hab (2018)</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mr-1"></div>
                        <span className="text-xs font-medium text-blue-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">
                        15.7<span className="text-xs ml-1 text-blue-600">por mil hab</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mr-1"></div>
                        <span className="text-xs font-medium text-blue-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">
                        12.3<span className="text-xs ml-1 text-blue-600">por mil hab</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-red-100 text-red-700">
                      21.7% maior em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeCategory === 'desenvolvimento') {
      return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-8">
            {/* Título da seção */}
            <h2 className="text-4xl font-bold text-amber-800 text-center mb-8">
              Desenvolvimento
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative h-[600px]">
              {/* Imagem 3D central */}
              <div className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none">
                <img 
                  src={Socioeconomico} 
                  alt="Representação 3D de desenvolvimento socioeconômico" 
                  className="h-[500px] object-contain"
                />
              </div>
              
              {/* Cards posicionados absolutamente com conteúdo direto */}
              <div className="absolute top-0 left-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-amber-800">
                      PIB per capita
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full text-white">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 mb-2">Dados de 2021</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-600 mr-1"></div>
                        <span className="text-xs font-medium text-amber-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-amber-800">
                        12.500<span className="text-xs ml-1 text-amber-600">R$</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mr-1"></div>
                        <span className="text-xs font-medium text-amber-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-amber-800">
                        15.300<span className="text-xs ml-1 text-amber-600">€</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-amber-100 text-amber-700">
                      22.4% menor em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-amber-800">
                      IDHM
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full text-white">
                      <BarChart className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 mb-2">Índice de Desenvolvimento Humano Municipal</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-600 mr-1"></div>
                        <span className="text-xs font-medium text-amber-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-amber-800">
                        0.658
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mr-1"></div>
                        <span className="text-xs font-medium text-amber-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-amber-800">
                        0.712
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-amber-100 text-amber-700">
                      8.2% menor em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-amber-800">
                      Taxa de Desemprego
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full text-white">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-600 mr-1"></div>
                        <span className="text-xs font-medium text-amber-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-amber-800">
                        12.3<span className="text-xs ml-1 text-amber-600">%</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mr-1"></div>
                        <span className="text-xs font-medium text-amber-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-amber-800">
                        8.7<span className="text-xs ml-1 text-amber-600">%</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-red-100 text-red-700">
                      29.3% maior em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-amber-800">
                      Segurança Pública
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full text-white">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 mb-2">Taxa de criminalidade por mil habitantes</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-600 mr-1"></div>
                        <span className="text-xs font-medium text-amber-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-amber-800">
                        32.8<span className="text-xs ml-1 text-amber-600">ocorrências/mil hab</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mr-1"></div>
                        <span className="text-xs font-medium text-amber-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-amber-800">
                        24.1<span className="text-xs ml-1 text-amber-600">ocorrências/mil hab</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-red-100 text-red-700">
                      26.5% maior em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeCategory === 'educacao') {
      return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-8">
            {/* Título da seção */}
            <h2 className="text-4xl font-bold text-emerald-800 text-center mb-8">
              Educação
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative h-[600px]">
              {/* Imagem 3D central */}
              <div className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none">
                <img 
                  src={Educacao} 
                  alt="Representação 3D de educação" 
                  className="h-[500px] object-contain"
                />
              </div>
              
              {/* Cards posicionados absolutamente com conteúdo direto */}
              <div className="absolute top-0 left-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-emerald-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-emerald-800">
                      Taxa de Alfabetização
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-500 rounded-full text-white">
                      <Book className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 mr-1"></div>
                        <span className="text-xs font-medium text-emerald-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        91.4<span className="text-xs ml-1 text-emerald-600">%</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                        <span className="text-xs font-medium text-emerald-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        94.8<span className="text-xs ml-1 text-emerald-600">%</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-emerald-100 text-emerald-700">
                      3.6% menor em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-emerald-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-emerald-800">
                      Relação Aluno/Professor
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-500 rounded-full text-white">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 mr-1"></div>
                        <span className="text-xs font-medium text-emerald-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        24.3<span className="text-xs ml-1 text-emerald-600">alunos/prof</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                        <span className="text-xs font-medium text-emerald-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        18.5<span className="text-xs ml-1 text-emerald-600">alunos/prof</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-red-100 text-red-700">
                      31.4% maior em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-emerald-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-emerald-800">
                      Acesso a Ensino Técnico e Superior
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-500 rounded-full text-white">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 mr-1"></div>
                        <span className="text-xs font-medium text-emerald-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        12.6<span className="text-xs ml-1 text-emerald-600">%</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                        <span className="text-xs font-medium text-emerald-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        18.2<span className="text-xs ml-1 text-emerald-600">%</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-emerald-100 text-emerald-700">
                      30.8% menor em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-emerald-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-emerald-800">
                      Iniciativas Bilíngues
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-500 rounded-full text-white">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 mb-2">Escolas com programas de ensino bilíngue</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 mr-1"></div>
                        <span className="text-xs font-medium text-emerald-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        2<span className="text-xs ml-1 text-emerald-600">escolas</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                        <span className="text-xs font-medium text-emerald-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        5<span className="text-xs ml-1 text-emerald-600">escolas</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-emerald-100 text-emerald-700">
                      60% menos escolas em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeCategory === 'meio_ambiente') {
      return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-8">
            {/* Título da seção */}
            <h2 className="text-4xl font-bold text-teal-800 text-center mb-8">
              Meio Ambiente
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative h-[600px]">
              {/* Imagem 3D central */}
              <div className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none">
                <img 
                  src={Ambiente} 
                  alt="Representação 3D de meio ambiente" 
                  className="h-[500px] object-contain"
                />
              </div>
              
              {/* Cards posicionados absolutamente com conteúdo direto */}
              <div className="absolute top-0 left-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-teal-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-teal-800">
                      Áreas Protegidas
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-teal-500 rounded-full text-white">
                      <Leaf className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-600 mr-1"></div>
                        <span className="text-xs font-medium text-teal-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-teal-800">
                        68<span className="text-xs ml-1 text-teal-600">% do território</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-400 mr-1"></div>
                        <span className="text-xs font-medium text-teal-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-teal-800">
                        78<span className="text-xs ml-1 text-teal-600">% do território</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-teal-100 text-teal-700">
                      14.7% menor em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-teal-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-teal-800">
                      Taxa de Desmatamento
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-teal-500 rounded-full text-white">
                      <Axe className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-teal-600 mb-2">Dados anuais 2020-2022</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-600 mr-1"></div>
                        <span className="text-xs font-medium text-teal-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-teal-800">
                        0.7<span className="text-xs ml-1 text-teal-600">% ao ano</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-400 mr-1"></div>
                        <span className="text-xs font-medium text-teal-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-teal-800">
                        0.3<span className="text-xs ml-1 text-teal-600">% ao ano</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-red-100 text-red-700">
                      133.3% maior em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-teal-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-teal-800">
                      Gestão de Resíduos Sólidos
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-teal-500 rounded-full text-white">
                      <Recycle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-600 mr-1"></div>
                        <span className="text-xs font-medium text-teal-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-teal-800">
                        42.7<span className="text-xs ml-1 text-teal-600">%</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-400 mr-1"></div>
                        <span className="text-xs font-medium text-teal-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-teal-800">
                        76.5<span className="text-xs ml-1 text-teal-600">%</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-teal-100 text-teal-700">
                      44.2% menor em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 w-[30%] z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-teal-100 p-4 h-full transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-teal-800">
                      Impacto de Atividades Extrativistas
                    </h3>
                    <div className="w-8 h-8 flex items-center justify-center bg-teal-500 rounded-full text-white">
                      <Pickaxe className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-teal-600 mb-2">Área afetada por extração mineral</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-600 mr-1"></div>
                        <span className="text-xs font-medium text-teal-700">Oiapoque</span>
                      </div>
                      <span className="text-sm font-bold text-teal-800">
                        5.4<span className="text-xs ml-1 text-teal-600">% do território</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-400 mr-1"></div>
                        <span className="text-xs font-medium text-teal-700">Saint-Georges</span>
                      </div>
                      <span className="text-sm font-bold text-teal-800">
                        2.1<span className="text-xs ml-1 text-teal-600">% do território</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full text-center bg-red-100 text-red-700">
                      157.1% maior em Oiapoque
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }

    // Renderização para outras categorias (mantém o comportamento original)
  return (
      <>
        {/* Grid de indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredIndicators.map((indicator) => {
            const IndicatorIcon = getIconForIndicator(indicator.title);
            
            return (
              <div 
                key={indicator.id}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  {indicator.title}
                </h3>
                <div className="flex items-center gap-3">
                  <IndicatorIcon className="w-10 h-10 text-green-500" />
                  <span className="text-2xl md:text-3xl font-bold text-gray-800">
                    {indicator.value}
                    <span className="text-sm ml-1 text-gray-500">{indicator.unit}</span>
                  </span>
          </div>
        </div>
            );
          })}
      </div>

        {/* Gráfico ou visualização relacionada à categoria */}
        <div className="mt-12 p-8 bg-green-50 rounded-xl flex flex-col items-center">
          <h3 className="text-xl font-semibold text-green-800 mb-4">
            {activeCategory === 'desenvolvimento' ? 'Desenvolvimento Socioeconômico' :
             activeCategory === 'populacao' ? 'Dados Demográficos' :
             activeCategory === 'educacao' ? 'Estatísticas Educacionais' :
             'Indicadores Ambientais'}
          </h3>
          <p className="text-green-700 text-center max-w-3xl mb-6">
            Este é um indicador composto que resume a performance das cidades gêmeas 
            em relação a outros municípios da região fronteiriça.
          </p>
          <div className="h-12 w-full max-w-lg bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-green-500 flex items-center justify-end pr-3 text-white font-medium"
              style={{ width: '65%' }}
            >
              65%
        </div>
          </div>
          <span className="text-sm text-gray-500">
            Fonte: Dados de pesquisa PIT-T (2023)
          </span>
        </div>
      </>
    );
  };

  // Função de renderização de card específico para indicadores de saúde
  const renderHealthCard = (indicator: HealthIndicator) => {
    if (!indicator) return null;
    
    const IconComponent = indicator.icon || Heart;
    
    // Calcular a diferença percentual entre os valores (quando possível)
    let difference = null;
    if (!isNaN(Number(indicator.oiapoque.value)) && !isNaN(Number(indicator.saintGeorges.value))) {
      const value1 = Number(indicator.oiapoque.value);
      const value2 = Number(indicator.saintGeorges.value);
      if (value1 > 0 && value2 > 0) {
        difference = ((value2 - value1) / value1) * 100;
      }
    }
    
    return (
      <div 
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-green-100 p-4 h-full transform transition-transform duration-300 hover:scale-105"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-medium text-green-800">
                {indicator.title}
              </h3>
          <div className="w-8 h-8 flex items-center justify-center bg-green-500 rounded-full text-white">
            <IconComponent className="w-4 h-4" />
          </div>
        </div>
        
        {indicator.description && (
          <p className="text-xs text-green-600 mb-2">{indicator.description}</p>
        )}
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-600 mr-1"></div>
              <span className="text-xs font-medium text-green-700">Oiapoque</span>
            </div>
            <span className="text-sm font-bold text-green-800">
              {indicator.oiapoque.value}
              <span className="text-xs ml-1 text-green-600">{indicator.oiapoque.unit}</span>
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
              <span className="text-xs font-medium text-green-700">Saint-Georges</span>
            </div>
            <span className="text-sm font-bold text-green-800">
              {indicator.saintGeorges.value}
              <span className="text-xs ml-1 text-green-600">{indicator.saintGeorges.unit}</span>
            </span>
          </div>
          
          {difference !== null && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full text-center ${difference > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {difference > 0 
                ? `${Math.abs(difference).toFixed(1)}% menor em Oiapoque` 
                : `${Math.abs(difference).toFixed(1)}% maior em Oiapoque`}
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'livros', label: 'Livros', icon: Book },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
    { id: 'artigos', label: 'Artigos', icon: File },
    { id: 'outros', label: 'Outros', icon: MoreHorizontal }
  ];

  // Função para renderizar o conteúdo do acervo digital
  const renderDigitalCollectionContent = () => {
    // Dados mockados para cada categoria
    const mockData = {
      livros: [
        { id: 1, titulo: "Fronteiras e Relações Internacionais", autor: "Maria Silva", ano: "2022", link: "#" },
        { id: 2, titulo: "História do Oiapoque", autor: "João Santos", ano: "2021", link: "#" },
        { id: 3, titulo: "Povos da Fronteira Franco-Brasileira", autor: "Ana Souza", ano: "2023", link: "#" },
        { id: 4, titulo: "Desenvolvimento Sustentável na Amazônia", autor: "Pedro Lima", ano: "2020", link: "#" },
        { id: 5, titulo: "Cultura e Sociedade na Fronteira", autor: "Carlos Mendes", ano: "2022", link: "#" }
      ],
      relatorios: [
        { id: 1, titulo: "Relatório Socioeconômico 2023", instituicao: "UNIFAP", data: "2023", link: "#" },
        { id: 2, titulo: "Análise do Fluxo Migratório", instituicao: "IBGE", data: "2022", link: "#" },
        { id: 3, titulo: "Indicadores de Saúde na Fronteira", instituicao: "Ministério da Saúde", data: "2023", link: "#" },
        { id: 4, titulo: "Educação Transfronteiriça", instituicao: "Secretaria de Educação", data: "2022", link: "#" },
        { id: 5, titulo: "Comércio Internacional Local", instituicao: "Ministério da Economia", data: "2023", link: "#" }
      ],
      artigos: [
        { id: 1, titulo: "Desafios da Saúde na Fronteira", autor: "Dr. Roberto Alves", revista: "Revista Fronteiras", ano: "2023", link: "#" },
        { id: 2, titulo: "Educação Bilíngue", autor: "Profa. Maria Gomes", revista: "Educação & Sociedade", ano: "2022", link: "#" },
        { id: 3, titulo: "Economia Local", autor: "Dr. José Silva", revista: "Economia Regional", ano: "2023", link: "#" },
        { id: 4, titulo: "Meio Ambiente e Desenvolvimento", autor: "Dra. Ana Paula Santos", revista: "Amazônia Hoje", ano: "2022", link: "#" },
        { id: 5, titulo: "Cultura e Identidade", autor: "Prof. Carlos Eduardo", revista: "Antropologia Social", ano: "2023", link: "#" }
      ],
      outros: [
        { id: 1, titulo: "Documentário: Vida na Fronteira", tipo: "Vídeo", autor: "João Cinematográfica", ano: "2023", link: "#" },
        { id: 2, titulo: "Mapa Interativo da Região", tipo: "Recurso Digital", autor: "Equipe GeoFront", ano: "2022", link: "#" },
        { id: 3, titulo: "Podcast: Vozes da Fronteira", tipo: "Áudio", autor: "Rádio Local", ano: "2023", link: "#" },
        { id: 4, titulo: "Atlas da Região Fronteiriça", tipo: "Material Cartográfico", autor: "Instituto de Geografia", ano: "2022", link: "#" },
        { id: 5, titulo: "Exposição Virtual: Fronteiras", tipo: "Galeria Digital", autor: "Museu Regional", ano: "2023", link: "#" }
      ]
    };

    const renderTable = () => {
      let data;
      let headers;

      switch(activeTab) {
        case 'livros':
          data = mockData.livros;
          headers = ['Título', 'Autor', 'Ano', 'Ação'];
          return (
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-green-50">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.autor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.ano}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href={item.link} className="text-green-600 hover:text-green-900">Acessar</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 'relatorios':
          data = mockData.relatorios;
          headers = ['Título', 'Instituição', 'Data', 'Ação'];
          return (
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-green-50">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.instituicao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.data}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href={item.link} className="text-green-600 hover:text-green-900">Acessar</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 'artigos':
          data = mockData.artigos;
          headers = ['Título', 'Autor', 'Revista', 'Ano', 'Ação'];
          return (
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-green-50">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.autor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.revista}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.ano}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href={item.link} className="text-green-600 hover:text-green-900">Acessar</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 'outros':
          data = mockData.outros;
          headers = ['Título', 'Tipo', 'Autor', 'Ano', 'Ação'];
          return (
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-green-50">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.tipo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.autor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.ano}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href={item.link} className="text-green-600 hover:text-green-900">Acessar</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        default:
          return null;
      }
    };

    return (
      <div className="overflow-x-auto">
        {renderTable()}
      </div>
    );
  };

  const renderGalleries = () => {
    // Dados mockados para as galerias
    const mockGalleries: Gallery[] = [
      {
        id: 1,
        title: "Galeria Oiapoque",
        description: "Imagens da cidade de Oiapoque, mostrando seus pontos turísticos, cultura e cotidiano.",
        images: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Ponte_Oiapoque_geral.jpg", alt: "Ponte Binacional" },
          { url: "https://www.gov.br/mre/pt-br/assuntos/noticias/ponte-brasil-franca-no-amapa-comeca-a-receber-veiculos-estrangeiros/arco_capa_pica.jpg/@@images/image/full", alt: "Marco Fronteiriço" },
          { url: "https://i0.wp.com/www.portalholofote.com.br/wp-content/uploads/2023/09/WhatsApp-Image-2023-09-13-at-17.29.59-1.jpeg", alt: "Cidade de Oiapoque" },
          { url: "https://diariodoamapa.com.br/wp-content/uploads/2023/03/Oiapoque-Marco-Zero-1-1280x720.jpg", alt: "Marco Zero" }
        ]
      },
      {
        id: 2,
        title: "Galeria Saint-Georges",
        description: "A comuna de Saint-Georges-de-l'Oyapock na Guiana Francesa, sua arquitetura, paisagens e cultura local.",
        images: [
          { url: "https://www.ctguyane.fr/app/uploads/Saint-Georges-scaled.jpg", alt: "Vista de Saint-Georges" },
          { url: "https://www.blada.com/data/File/2018/jgaillot30104.jpg", alt: "Rua de Saint-Georges" },
          { url: "https://3.bp.blogspot.com/-YkBbfZK6vw8/V_uiIBqGg9I/AAAAAAAAUUI/JYzrkpX7GwYYkhiR05S9i5q7ozrDZf8IgCLcB/s1600/Saint-georges-guiana-francesa.jpg", alt: "Rio Oiapoque" },
          { url: "https://www.blada.com/data/File/2020/jmarlin19021.jpg", alt: "Praça Central" }
        ]
      }
    ];

    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Galerias de Imagens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            className="relative rounded-xl overflow-hidden shadow-lg h-96"
            style={{ 
              backgroundImage: `url(${Oiapoque})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white mb-2">Galeria Oiapoque</h3>
              <p className="text-white/90 mb-4">Imagens da cidade de Oiapoque, mostrando seus pontos turísticos, cultura e cotidiano.</p>
              <button className="w-full mt-2 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                Ver galeria completa
              </button>
            </div>
          </div>

          <div 
            className="relative rounded-xl overflow-hidden shadow-lg h-96"
            style={{ 
              backgroundImage: `url(${SaintGeorges})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white mb-2">Galeria Saint-Georges</h3>
              <p className="text-white/90 mb-4">A comuna de Saint-Georges-de-l'Oyapock na Guiana Francesa, sua arquitetura, paisagens e cultura local.</p>
              <button className="w-full mt-2 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                Ver galeria completa
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-xl text-gray-600">{t('locationDetails.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header com design moderno 3D */}
      <div className="relative h-64 md:h-80 overflow-hidden mb-6">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Ponte})` }}
        />
        
        {/* Overlay gradiente moderno */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        
        {/* Elementos de design modernos */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm animate-float"></div>
          <div className="absolute top-20 right-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm animate-float-slow"></div>
          <div className="absolute bottom-10 left-1/4 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm animate-float-medium"></div>
        </div>
        
        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            Cidades Gêmeas
            </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-4 drop-shadow-lg">
            {location.name} e {location.twin_city || 'Saint-Georges'}
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl drop-shadow-lg">
            Dados sobre saúde, população, desenvolvimento socioeconômico, educação e meio ambiente
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Menu de navegação com efeito de flutuação */}
        <div className="flex justify-center mb-8">
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-3 shadow-lg border border-green-100 inline-flex gap-2">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              const isActive = activeCategory === category.id;
              
              let bgColor = '';
              let textColor = '';
              let hoverBg = '';
              
              switch(category.id) {
                case 'saude':
                  bgColor = isActive ? 'bg-green-500' : '';
                  textColor = isActive ? 'text-white' : 'text-green-700';
                  hoverBg = !isActive ? 'hover:bg-green-100' : '';
                  break;
                case 'populacao':
                  bgColor = isActive ? 'bg-blue-500' : '';
                  textColor = isActive ? 'text-white' : 'text-blue-700';
                  hoverBg = !isActive ? 'hover:bg-blue-100' : '';
                  break;
                case 'desenvolvimento':
                  bgColor = isActive ? 'bg-amber-500' : '';
                  textColor = isActive ? 'text-white' : 'text-amber-700';
                  hoverBg = !isActive ? 'hover:bg-amber-100' : '';
                  break;
                case 'educacao':
                  bgColor = isActive ? 'bg-emerald-500' : '';
                  textColor = isActive ? 'text-white' : 'text-emerald-700';
                  hoverBg = !isActive ? 'hover:bg-emerald-100' : '';
                  break;
                case 'meio_ambiente':
                  bgColor = isActive ? 'bg-teal-500' : '';
                  textColor = isActive ? 'text-white' : 'text-teal-700';
                  hoverBg = !isActive ? 'hover:bg-teal-100' : '';
                  break;
              }
              
              return (
              <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                    ${bgColor} ${textColor} ${hoverBg}
                    ${isActive ? 'shadow-md' : ''}
                  `}
                >
                  <CategoryIcon className="w-5 h-5" />
                  <span className="font-medium">
                    {category.label}
                  </span>
              </button>
              );
            })}
            </div>
        </div>

        {/* Conteúdo principal - terceira linha com o layout redesenhado */}
        <div className="mb-12">
          {renderCategoryContent()}
        </div>
        
        {/* Quarta linha - Acervo Digital */}
        <div className="mt-12">
          <h2 className="text-4xl font-bold text-green-800 text-center mb-8">
            Acervo Digital
          </h2>
          <div className="flex justify-center mb-4">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-green-500 text-white' : 'bg-white text-green-700 hover:bg-green-100'}`}
                >
                  <TabIcon className="w-5 h-5" />
                  {tab.label}
              </button>
              );
            })}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderDigitalCollectionContent()}
          </div>
        </div>

        {/* Quinta linha - Galerias */}
        <div className="mt-12">
          <h2 className="text-4xl font-bold text-green-800 text-center mb-8">
            Galerias
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderGalleries()}
        </div>
        </div>

      </div>
      
      {/* Aplicar estilos de animação usando style convencional do React */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
    </div>
  );
};

export default LocationDetails;