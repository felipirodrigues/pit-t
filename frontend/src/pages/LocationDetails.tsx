import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, TrendingUp, GraduationCap, Leaf, Building, DollarSign, BarChart, Percent, Heart, Droplet, Syringe, Activity, Users as UsersIcon, Thermometer, Book, FileText, File, MoreHorizontal, AlertCircle, Globe, Axe, Recycle, Pickaxe } from 'lucide-react';
import Saude from '../images/saude2.png'
import Populacao from '../images/populacao2.png'
import Socioeconomico from '../images/socioeconomico2.png'
import Educacao from '../images/educacao2.png'
import Ambiente from '../images/ambiente2.png'
import api from '../services/api';
import axios from 'axios';
import Oiapoque from '../images/oiapoque.jpg'
import SaintGeorges from '../images/saintgeorge2.jpg'
import Lethem from '../images/lethem2.jpg'
import Bonfim from '../images/bonfim2.jpeg'
import SaintLaurent from '../images/saintlaurent2.jpg'
import SantaElena from '../images/santaelena2.jpg'
import Pacaraima from '../images/pacaraima2.jpg'
import Nickerie from '../images/nickerie2.jpg'
import Corriverton from '../images/corriverton2.jpg'
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

// Interface TwinCity para compatibilidade com os dados do Home.tsx
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

interface Indicator {
  id: number;
  location_id: number;
  category: string; // saude, populacao, desenvolvimento, educacao, meio_ambiente
  title: string;
  value: string;
  unit?: string;
  description?: string;
  icon?: string | React.ComponentType<any>;
  date?: string;
  source?: string;
  sourceLink?: string;
}

interface ComparativeIndicator {
  id: number;
  title: string;
  cityA: {
    value: string;
    unit: string;
  };
  cityB: {
    value: string;
    unit: string;
  };
  description?: string;
  icon?: string | React.ComponentType<any>;
  study_date_start?: string;
  study_date_end?: string;
  source_title?: string;
  source_link?: string;
}

interface HealthIndicator extends ComparativeIndicator {}
interface PopulationIndicator extends ComparativeIndicator {}
interface DevelopmentIndicator extends ComparativeIndicator {}

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

// Adicionar função para formatar datas (após as interfaces e antes do componente)
const extractYear = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // Extrai apenas o ano da data
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch (e) {
    console.error('Erro ao formatar data:', e);
    return dateString;
  }
};

const LocationDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [twinCity, setTwinCity] = useState<TwinCity | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [healthIndicators, setHealthIndicators] = useState<HealthIndicator[]>([]);
  const [activeCategory, setActiveCategory] = useState('Saúde');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('livros');
  const [digitalCollection, setDigitalCollection] = useState<{
    livros: any[];
    relatorios: any[];
    artigos: any[];
    outros: any[];
  }>({ livros: [], relatorios: [], artigos: [], outros: [] });
  const [galleries, setGalleries] = useState<any[]>([]);
  const [populationIndicators, setPopulationIndicators] = useState<PopulationIndicator[]>([]);
  const [developmentIndicators, setDevelopmentIndicators] = useState<DevelopmentIndicator[]>([]);
  const [educationIndicators, setEducationIndicators] = useState<ComparativeIndicator[]>([]);
  const [environmentIndicators, setEnvironmentIndicators] = useState<ComparativeIndicator[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar dados da cidade gêmea
        const twinCityResponse = await api.get(`/twin-cities/${id}`);
        const twinCityData = twinCityResponse.data;
        
        if (!twinCityData) {
          throw new Error('Não foi possível obter dados da cidade gêmea');
        }
        
        setTwinCity(twinCityData);
        
        // Configurar dados do location baseado nos dados da cidade gêmea
        setLocation({
          id: Number(id),
          name: twinCityData.cityA_name,
          twin_city: twinCityData.cityB_name,
          description: twinCityData.description || "Cidades gêmeas na fronteira",
          latitude: twinCityData.cityA_latitude,
          longitude: twinCityData.cityA_longitude,
          country: "Brasil"
        });

        // Buscar indicadores da API /indicators usando twin_city_id
        const indicatorsResponse = await api.get(`/indicators?twin_city_id=${id}`);
        
        if (indicatorsResponse.data && Array.isArray(indicatorsResponse.data)) {
          // Separar indicadores por categoria
          const allIndicators = indicatorsResponse.data;
          
          // Função auxiliar para comparação de categorias ignorando case e acentuação
          const matchCategory = (indicatorCategory: string, targetCategory: string) => {
            if (!indicatorCategory) return false;
            
            // Normaliza removendo acentos e convertendo para minúsculas
            const normalize = (text: string) => text.toLowerCase()
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            const normalizedIndicator = normalize(indicatorCategory);
            const normalizedTarget = normalize(targetCategory);
            
            return normalizedIndicator === normalizedTarget;
          };
          
          // Indicadores de saúde
          const healthIndicators = allIndicators
            .filter(indicator => matchCategory(indicator.category, 'Saúde'))
            .map(indicator => ({
              id: indicator.id,
              title: indicator.title,
              description: indicator.description || '',
              cityA: {
                value: indicator.city_a_value || '0',
                unit: indicator.unit || ''
              },
              cityB: {
                value: indicator.city_b_value || '0',
                unit: indicator.unit || ''
              },
              icon: getIconByName(indicator.icon),
              study_date_start: indicator.study_date_start || '',
              study_date_end: indicator.study_date_end || '',
              source_title: indicator.source_title || '',
              source_link: indicator.source_link || ''
            }));
          
          // Indicadores de população
          const populationIndicators = allIndicators
            .filter(indicator => matchCategory(indicator.category, 'População'))
            .map(indicator => ({
              id: indicator.id,
              title: indicator.title,
              description: indicator.description || '',
              cityA: {
                value: indicator.city_a_value || '0',
                unit: indicator.unit || ''
              },
              cityB: {
                value: indicator.city_b_value || '0',
                unit: indicator.unit || ''
              },
              icon: getIconByName(indicator.icon),
              study_date_start: indicator.study_date_start || '',
              study_date_end: indicator.study_date_end || '',
              source_title: indicator.source_title || '',
              source_link: indicator.source_link || ''
            }));
          
          // Indicadores de desenvolvimento
          const developmentIndicators = allIndicators
            .filter(indicator => matchCategory(indicator.category, 'Comércio'))
            .map(indicator => ({
              id: indicator.id,
              title: indicator.title,
              description: indicator.description || '',
              cityA: {
                value: indicator.city_a_value || '0',
                unit: indicator.unit || ''
              },
              cityB: {
                value: indicator.city_b_value || '0',
                unit: indicator.unit || ''
              },
              icon: getIconByName(indicator.icon),
              study_date_start: indicator.study_date_start || '',
              study_date_end: indicator.study_date_end || '',
              source_title: indicator.source_title || '',
              source_link: indicator.source_link || ''
            }));
          
          // Indicadores de educação
          const educationIndicators = allIndicators
            .filter(indicator => matchCategory(indicator.category, 'Educação'))
            .map(indicator => ({
              id: indicator.id,
              title: indicator.title,
              description: indicator.description || '',
              cityA: {
                value: indicator.city_a_value || '0',
                unit: indicator.unit || ''
              },
              cityB: {
                value: indicator.city_b_value || '0',
                unit: indicator.unit || ''
              },
              icon: getIconByName(indicator.icon),
              study_date_start: indicator.study_date_start || '',
              study_date_end: indicator.study_date_end || '',
              source_title: indicator.source_title || '',
              source_link: indicator.source_link || ''
            }));
          
          // Indicadores de meio ambiente
          const environmentIndicators = allIndicators
            .filter(indicator => matchCategory(indicator.category, 'Meio Ambiente'))
            .map(indicator => ({
              id: indicator.id,
              title: indicator.title,
              description: indicator.description || '',
              cityA: {
                value: indicator.city_a_value || '0',
                unit: indicator.unit || ''
              },
              cityB: {
                value: indicator.city_b_value || '0',
                unit: indicator.unit || ''
              },
              icon: getIconByName(indicator.icon),
              study_date_start: indicator.study_date_start || '',
              study_date_end: indicator.study_date_end || '',
              source_title: indicator.source_title || '',
              source_link: indicator.source_link || ''
            }));
          
          // Indicadores para exibição normal
          const regularIndicators = allIndicators.map(indicator => ({
            id: indicator.id,
            location_id: Number(id),
            category: indicator.category,
            title: indicator.title,
            value: indicator.city_a_value || '0',
            unit: indicator.unit || '',
            description: indicator.description || '',
            icon: getIconByName(indicator.icon),
            study_date_start: indicator.study_date_start || '',
            study_date_end: indicator.study_date_end || '',
            source_title: indicator.source_title || '',
            source_link: indicator.source_link || ''
          }));
          
          // Atualizar os estados
          setIndicators(regularIndicators);
          setHealthIndicators(healthIndicators);
          setPopulationIndicators(populationIndicators);
          setDevelopmentIndicators(developmentIndicators);
          setEducationIndicators(educationIndicators);
          setEnvironmentIndicators(environmentIndicators);
        } else {
          // Se não houver dados de indicadores, inicializar arrays vazios
          setIndicators([]);
          setHealthIndicators([]);
          setPopulationIndicators([]);
          setDevelopmentIndicators([]);
          setEducationIndicators([]);
          setEnvironmentIndicators([]);
          console.warn('Dados de indicadores vazios ou inválidos');
        }
        
        // Buscar acervo digital da API
        const digitalCollectionResponse = await api.get(`/digital-collection?twin_city_id=${id}&limit=100`);
        if (digitalCollectionResponse.data && Array.isArray(digitalCollectionResponse.data.documents)) {
          // Separar por categoria
          const docs = digitalCollectionResponse.data.documents;
          setDigitalCollection({
            livros: docs.filter((d: any) => d.category && d.category.toLowerCase() === 'books'),
            relatorios: docs.filter((d: any) => d.category && d.category.toLowerCase() === 'reports'),
            artigos: docs.filter((d: any) => d.category && d.category.toLowerCase() === 'articles'),
            outros: docs.filter((d: any) => d.category && d.category.toLowerCase() === 'others')
          });
        } else {
          setDigitalCollection({ livros: [], relatorios: [], artigos: [], outros: [] });
        }
        
        // Buscar outros dados da API (digital collection, galleries, etc.)
        setGalleries([
          {
            id: 1,
            title: `Galeria ${twinCityData.cityA_name}`,
            description: `Imagens da cidade de ${twinCityData.cityA_name}`,
            images: []
          },
          {
            id: 2,
            title: `Galeria ${twinCityData.cityB_name}`,
            description: `Imagens da comuna de ${twinCityData.cityB_name}`,
            images: []
          }
        ]);
        
      } catch (err: unknown) {
        console.error('Erro ao carregar dados:', err);
        
        // Limpar todos os estados de dados
        setTwinCity(null);
        setLocation(null);
        setIndicators([]);
        setHealthIndicators([]);
        setPopulationIndicators([]);
        setDevelopmentIndicators([]);
        setEducationIndicators([]);
        setEnvironmentIndicators([]);
        setGalleries([]);
        setDigitalCollection({ livros: [], relatorios: [], artigos: [], outros: [] });
        
        // Definir mensagem de erro apropriada
        if (axios.isAxiosError(err)) {
          if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
            setError(t('locationDetails.error.connectionFailed'));
          } else if (err.response) {
            if (err.response.status === 404) {
              setError(t('locationDetails.error.cityNotFound', { id }));
            } else {
              setError(t('locationDetails.error.serverError', { status: err.response.status, statusText: err.response.statusText }));
            }
          } else {
            setError(t('locationDetails.error.networkError'));
          }
        } else if (err instanceof Error) {
          setError(t('locationDetails.error.generalError', { message: err.message }));
        } else {
          setError(t('locationDetails.error.unknownError'));
        }
      } finally {
        setLoading(false);
      }
    };

    // Auxiliar para converter nome de ícone em componente
    const getIconByName = (iconName: string | undefined): React.ComponentType<any> => {
      if (!iconName) return Thermometer; // Ícone padrão
      
      // Mapear nomes de ícones para componentes do Lucide
      const iconMap: { [key: string]: React.ComponentType<any> } = {
        // Saúde
        'thermometer': Thermometer,
        'heart': Heart,
        'activity': Activity,
        'syringe': Syringe,
        'droplet': Droplet,
        
        // População e demografia
        'users': Users,
        'map-pin': MapPin,
        
        // Desenvolvimento e economia
        'building': Building,
        'trending-up': TrendingUp,
        'dollar-sign': DollarSign,
        'bar-chart': BarChart,
        'percent': Percent,
        
        // Educação
        'graduation-cap': GraduationCap,
        'book': Book,
        'globe': Globe,
        
        // Meio ambiente
        'leaf': Leaf,
        'axe': Axe,
        'recycle': Recycle,
        'pickaxe': Pickaxe,
        
        // Geral
        'file-text': FileText,
        'file': File,
        'alert-circle': AlertCircle
      };
      
      // Converter para minúsculas e remover espaços
      const normalizedName = iconName.toLowerCase().replace(/\s+/g, '-');
      
      // Verificar se o ícone está no mapa, caso contrário retornar o ícone padrão
      return iconMap[normalizedName] || Thermometer;
    };

    if (id) {
      fetchLocationData();
    }
  }, [id]);

  const categories = [
    { id: 'Saúde', label: t('locationDetails.categories.health'), icon: MapPin },
    { id: 'População', label: t('locationDetails.categories.population'), icon: Users },
    { id: 'Comércio', label: t('locationDetails.categories.commerce'), icon: TrendingUp },
    { id: 'Educação', label: t('locationDetails.categories.education'), icon: GraduationCap },
    { id: 'Meio Ambiente', label: t('locationDetails.categories.environment'), icon: Leaf }
  ];

  const getIconForIndicator = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('pib') || lowerTitle.includes('renda')) return DollarSign;
    if (lowerTitle.includes('taxa') || lowerTitle.includes('índice')) return BarChart;
    if (lowerTitle.includes('percentual') || lowerTitle.includes('%')) return Percent;
    return Building;
  };

  // Adicionar função para normalizar categorias
  const normalizeCategory = (category: string) => {
    if (!category) return '';
    
    // Normaliza removendo acentos e convertendo para minúsculas
    const normalize = (text: string) => text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const normalizedInput = normalize(category);
    
    // Mapeamento de categorias padronizadas
    const categoryMap: { [key: string]: string } = {
      'saude': 'Saúde',
      'populacao': 'População',
      'comercio': 'Comércio',
      'educacao': 'Educação',
      'meio ambiente': 'Meio Ambiente',
      'meio_ambiente': 'Meio Ambiente'
    };
    
    // Retorna a categoria padronizada ou a original se não encontrada
    return categoryMap[normalizedInput] || category;
  };

  // Filtrar indicadores usando a normalização de categorias
  const filteredIndicators = indicators.filter(
    indicator => {
      const normalizedActiveCategory = normalizeCategory(activeCategory);
      return indicator.category === normalizedActiveCategory || 
        indicator.category.toLowerCase() === activeCategory.toLowerCase();
    }
  );

  // Adicionar função auxiliar para traduzir categorias
  const translateCategory = (category: string): string => {
    const categoryKey = category.toLowerCase();
    return t(`locationDetails.digitalCollection.categories.${categoryKey}`, { defaultValue: category });
  };

  // Função para renderizar um card genérico com cor personalizada (para população, desenvolvimento, etc.)
  const renderGenericCard = (indicator: ComparativeIndicator, color: 'blue' | 'amber' | 'emerald' | 'teal') => {
    if (!indicator) return null;
    
    // Determinar o componente de ícone
    const IconComponent = indicator.icon && typeof indicator.icon !== 'string' 
      ? indicator.icon 
      : Heart;
    
    // Calcular a diferença percentual entre os valores (quando possível)
    let difference = null;
    if (!isNaN(Number(indicator.cityA.value)) && !isNaN(Number(indicator.cityB.value))) {
      const value1 = Number(indicator.cityA.value);
      const value2 = Number(indicator.cityB.value);
      if (value1 > 0 && value2 > 0) {
        difference = ((value2 - value1) / value1) * 100;
      }
    }
    
    // Nomes das cidades
    const cityA = twinCity?.cityA_name || 'Cidade A';
    const cityB = twinCity?.cityB_name || 'Cidade B';
    
    // Classes baseadas na cor
    const textColor = `text-${color}-800`;
    const bgColor = `bg-${color}-500`;
    const borderColor = `border-${color}-100`;
    const descriptionColor = `text-${color}-600`;
    
    // Extrair anos das datas de estudo
    const yearStart = extractYear(indicator.study_date_start || '');
    const yearEnd = extractYear(indicator.study_date_end || '');
    
    // Formatar período
    const periodText = yearStart 
      ? (yearEnd && yearStart !== yearEnd) 
        ? `${yearStart} - ${yearEnd}` 
        : yearStart
      : '';
    
    return (
      <div 
        className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-md border ${borderColor} p-3 sm:p-4 h-full transform transition-transform duration-300 hover:scale-105`}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-sm sm:text-base font-medium ${textColor}`}>
            {indicator.title}
          </h3>
          <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center ${bgColor} rounded-full text-white`}>
            <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        
        {/* Data e fonte com melhor formatação */}
        {(periodText || indicator.source_title) && (
          <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 text-xs ${descriptionColor} border-b ${borderColor} pb-2`}>
            {periodText && (
              <div className="flex items-center mb-1 sm:mb-0">
                <span className="mr-1 opacity-70">Período:</span>
                <span>{periodText}</span>
              </div>
            )}
            {indicator.source_title && (
              <a 
                href={indicator.source_link || '#'}
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center hover:${textColor} transition-colors`}
              >
                <FileText className="w-3 h-3 mr-1" />
                <span className="underline truncate max-w-[150px] sm:max-w-none">{indicator.source_title}</span>
              </a>
            )}
          </div>
        )}
        
        {indicator.description && (
          <p className={`text-xs ${descriptionColor} mb-2 line-clamp-2 sm:line-clamp-none`}>{indicator.description}</p>
        )}
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full bg-${color}-600 mr-1`}></div>
              <span className={`text-xs font-medium ${descriptionColor}`}>{cityA}</span>
            </div>
            <span className={`text-sm font-bold ${textColor}`}>
              {indicator.cityA.value}
              <span className={`text-xs ml-1 ${descriptionColor}`}>{indicator.cityA.unit}</span>
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full bg-${color}-400 mr-1`}></div>
              <span className={`text-xs font-medium ${descriptionColor}`}>{cityB}</span>
            </div>
            <span className={`text-sm font-bold ${textColor}`}>
              {indicator.cityB.value}
              <span className={`text-xs ml-1 ${descriptionColor}`}>{indicator.cityB.unit}</span>
            </span>
          </div>
          
          {difference !== null && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full text-center ${difference > 0 ? `bg-${color}-100 ${descriptionColor}` : 'bg-red-100 text-red-700'}`}>
              {difference > 0 
                ? `${Math.abs(difference).toFixed(1)}% menor em ${cityA}` 
                : `${Math.abs(difference).toFixed(1)}% maior em ${cityA}`}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCategoryContent = () => {
    // Nomes das cidades para uso nos cards
    const cityA = twinCity?.cityA_name || 'Cidade A';
    const cityB = twinCity?.cityB_name || 'Cidade B';
    
    if (activeCategory === 'Saúde') {
      return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-[500px] sm:min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-6 sm:py-8">
            {/* Título da seção */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 text-center mb-4 sm:mb-8">
              {t('locationDetails.categoryTitles.health')}
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative justify-center">
              {/* Imagem 3D central - escondida em mobile, visível em desktop */}
              <div className="absolute inset-0 z-10 hidden sm:flex justify-center items-center pointer-events-none">
                <img 
                  src={Saude} 
                  alt="Representação 3D do setor de saúde" 
                  className="h-[300px] md:h-[550px] object-contain"
                />
              </div>
              
              {/* Mobile: sistema de cards expandíveis */}
              {healthIndicators.length > 0 ? (
                <div className="sm:hidden w-full px-1">
                  <div className="space-y-3">
                    {healthIndicators.slice(0, 8).map((indicator, index) => (
                      <div key={indicator?.id || index}>
                        {renderCompactHealthCard(indicator)}
                      </div>
                    ))}
                  </div>
                  
                  {/* Botão "ver mais" se houver mais de 8 indicadores */}
                  {healthIndicators.length > 8 && (
                    <div className="mt-4 flex justify-center">
                      <button className="bg-white text-green-700 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
                        <MoreHorizontal className="w-4 h-4" />
                        <span>Ver mais {healthIndicators.length - 8} indicadores</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="sm:hidden w-full">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-green-100 p-6">
                    <p className="text-green-800 text-center">{t('locationDetails.noData.health')}</p>
                  </div>
                </div>
              )}

              {/* Desktop: grid ao redor da imagem (mantido como estava) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-3 gap-3 sm:gap-5 z-20 w-full max-w-6xl mx-auto">
                {/* Versão desktop: grid ao redor da imagem */}
                <div className="hidden sm:block col-span-1">{renderHealthCard(healthIndicators[0])}</div>
                <div className="hidden sm:block col-span-1"></div> {/* Espaço para imagem */}
                <div className="hidden sm:block col-span-1">{renderHealthCard(healthIndicators[1])}</div>

                <div className="hidden sm:block col-span-1">{renderHealthCard(healthIndicators[2])}</div>
                <div className="hidden sm:block col-span-1"></div> {/* Espaço para imagem */}
                <div className="hidden sm:block col-span-1">{renderHealthCard(healthIndicators[3])}</div>

                <div className="hidden sm:block col-span-1">{renderHealthCard(healthIndicators[4])}</div>
                <div className="hidden sm:block col-span-1">{renderHealthCard(healthIndicators[5])}</div>
                <div className="hidden sm:block col-span-1">{renderHealthCard(healthIndicators[6])}</div>
              </div>
            </div>

            {/* Versão desktop: indicadores adicionais quando há mais de 7 */}
            {healthIndicators.length > 7 && (
              <div className="hidden sm:block mt-8">
                <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">{t('locationDetails.moreIndicators.health')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {healthIndicators.slice(7).map((indicator, index) => (
                    <div key={indicator?.id || index + 7}>
                      {renderHealthCard(indicator)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else if (activeCategory === 'População') {
      return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-[500px] sm:min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-6 sm:py-8">
            {/* Título da seção */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 text-center mb-4 sm:mb-8">
              {t('locationDetails.categoryTitles.population')}
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative sm:h-[600px]">
              {/* Imagem 3D central - escondida em mobile */}
              <div className="absolute inset-0 z-10 hidden sm:flex justify-center items-center pointer-events-none">
                <img 
                  src={Populacao} 
                  alt="Representação 3D de população" 
                  className="h-[300px] md:h-[500px] object-contain"
                />
              </div>
              
              {/* Cards dinâmicos baseados nos dados da API */}
              {populationIndicators.length > 0 ? (
                <>
                  {/* Mobile: sistema de cards expandíveis */}
                  <div className="sm:hidden w-full px-1">
                    {/* Subcategorias em chips scrolláveis */}
                    <div className="flex overflow-x-auto pb-2 mb-3 hide-scrollbar">
                      <button className="flex-shrink-0 bg-blue-500 text-white px-4 py-1 rounded-full mr-2">
                        Todos
                      </button>
                      <button className="flex-shrink-0 bg-white text-blue-700 px-4 py-1 rounded-full mr-2 border border-blue-100">
                        Demografia
                      </button>
                      <button className="flex-shrink-0 bg-white text-blue-700 px-4 py-1 rounded-full mr-2 border border-blue-100">
                        Crescimento
                      </button>
                      <button className="flex-shrink-0 bg-white text-blue-700 px-4 py-1 rounded-full mr-2 border border-blue-100">
                        Densidade
                      </button>
                    </div>
                    
                    {/* Lista de cards expandíveis */}
                    <div className="space-y-3">
                      {populationIndicators.slice(0, 8).map((indicator, index) => (
                        <div key={indicator?.id || index}>
                          {renderCompactGenericCard(indicator, 'blue')}
                        </div>
                      ))}
                    </div>
                    
                    {/* Botão "ver mais" se houver mais de 8 indicadores */}
                    {populationIndicators.length > 8 && (
                      <div className="mt-4 flex justify-center">
                        <button className="bg-white text-blue-700 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
                          <MoreHorizontal className="w-4 h-4" />
                          <span>Ver mais {populationIndicators.length - 8} indicadores</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Desktop: cards posicionados em pontos específicos (mantido como estava) */}
                  <div className="hidden sm:block">
                    {populationIndicators.slice(0, 1).map((indicator, index) => (
                      <div key={indicator.id} className="absolute top-0 left-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'blue')}
                      </div>
                    ))}
                    
                    {populationIndicators.slice(1, 2).map((indicator, index) => (
                      <div key={indicator.id} className="absolute top-0 right-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'blue')}
                      </div>
                    ))}
                    
                    {populationIndicators.slice(2, 3).map((indicator, index) => (
                      <div key={indicator.id} className="absolute bottom-0 left-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'blue')}
                      </div>
                    ))}
                    
                    {populationIndicators.slice(3, 4).map((indicator, index) => (
                      <div key={indicator.id} className="absolute bottom-0 right-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'blue')}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-100 p-6">
                    <p className="text-blue-800 text-center">{t('locationDetails.noData.population')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Versão desktop: indicadores adicionais quando há mais de 4 */}
            {populationIndicators.length > 4 && (
              <div className="hidden sm:block mt-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">{t('locationDetails.moreIndicators.population')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {populationIndicators.slice(4).map((indicator, index) => (
                    <div key={indicator?.id || index + 4}>
                      {renderGenericCard(indicator, 'blue')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else if (activeCategory === 'Comércio') {
      return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 min-h-[500px] sm:min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-6 sm:py-8">
            {/* Título da seção */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 text-center mb-4 sm:mb-8">
              {t('locationDetails.categoryTitles.commerce')}
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative sm:h-[600px]">
              {/* Imagem 3D central - escondida em mobile */}
              <div className="absolute inset-0 z-10 hidden sm:flex justify-center items-center pointer-events-none">
                <img 
                  src={Socioeconomico} 
                  alt="Representação 3D de desenvolvimento socioeconômico" 
                  className="h-[300px] md:h-[500px] object-contain"
                />
              </div>
              
              {/* Cards dinâmicos baseados nos dados da API */}
              {developmentIndicators.length > 0 ? (
                <>
                  {/* Mobile: cards expandíveis */}
                  <div className="sm:hidden w-full px-1">
                    <div className="space-y-3">
                      {developmentIndicators.map((indicator, index) => (
                        <div key={indicator.id || index}>
                          {renderCompactGenericCard(indicator, 'amber')}
                        </div>
                      ))}
                    </div>
                  </div>
                
                  {/* Desktop: posicionamento dos cards em pontos específicos */}
                  <div className="hidden sm:block">
                    {developmentIndicators.slice(0, 1).map((indicator, index) => (
                      <div key={indicator.id} className="absolute top-0 left-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'amber')}
                      </div>
                    ))}
                    
                    {developmentIndicators.slice(1, 2).map((indicator, index) => (
                      <div key={indicator.id} className="absolute top-0 right-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'amber')}
                      </div>
                    ))}
                    
                    {developmentIndicators.slice(2, 3).map((indicator, index) => (
                      <div key={indicator.id} className="absolute bottom-0 left-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'amber')}
                      </div>
                    ))}
                    
                    {developmentIndicators.slice(3, 4).map((indicator, index) => (
                      <div key={indicator.id} className="absolute bottom-0 right-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'amber')}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-6">
                    <p className="text-amber-800 text-center">{t('locationDetails.noData.commerce')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (activeCategory === 'Educação') {
      return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 min-h-[500px] sm:min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-6 sm:py-8">
            {/* Título da seção */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800 text-center mb-4 sm:mb-8">
              {t('locationDetails.categoryTitles.education')}
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative sm:h-[600px]">
              {/* Imagem 3D central - escondida em mobile */}
              <div className="absolute inset-0 z-10 hidden sm:flex justify-center items-center pointer-events-none">
                <img 
                  src={Educacao} 
                  alt="Representação 3D de educação" 
                  className="h-[300px] md:h-[500px] object-contain"
                />
              </div>
              
              {/* Cards dinâmicos baseados nos dados da API */}
              {educationIndicators.length > 0 ? (
                <>
                  {/* Mobile: cards expandíveis */}
                  <div className="sm:hidden w-full px-1">
                    <div className="space-y-3">
                      {educationIndicators.map((indicator, index) => (
                        <div key={indicator.id || index}>
                          {renderCompactGenericCard(indicator, 'emerald')}
                        </div>
                      ))}
                    </div>
                  </div>
                
                  {/* Desktop: posicionamento dos cards em pontos específicos */}
                  <div className="hidden sm:block">
                    {educationIndicators.slice(0, 1).map((indicator, index) => (
                      <div key={indicator.id} className="absolute top-0 left-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'emerald')}
                      </div>
                    ))}
                    
                    {educationIndicators.slice(1, 2).map((indicator, index) => (
                      <div key={indicator.id} className="absolute top-0 right-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'emerald')}
                      </div>
                    ))}
                    
                    {/* Mostra cards adicionais apenas se existirem */}
                    {educationIndicators.slice(2, 3).map((indicator, index) => (
                      <div key={indicator.id} className="absolute bottom-0 left-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'emerald')}
                      </div>
                    ))}
                    
                    {educationIndicators.slice(3, 4).map((indicator, index) => (
                      <div key={indicator.id} className="absolute bottom-0 right-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'emerald')}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-emerald-100 p-6">
                    <p className="text-emerald-800 text-center">{t('locationDetails.noData.education')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (activeCategory === 'Meio Ambiente') {
      return (
        <div className="relative">
          {/* Container principal com fundo gradiente */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 min-h-[500px] sm:min-h-[700px] rounded-3xl overflow-hidden relative px-4 py-6 sm:py-8">
            {/* Título da seção */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-800 text-center mb-4 sm:mb-8">
              {t('locationDetails.categoryTitles.environment')}
            </h2>
            
            {/* Container para a imagem 3D central e cards ao redor */}
            <div className="relative sm:h-[600px]">
              {/* Imagem 3D central - escondida em mobile */}
              <div className="absolute inset-0 z-10 hidden sm:flex justify-center items-center pointer-events-none">
                <img 
                  src={Ambiente} 
                  alt="Representação 3D de meio ambiente" 
                  className="h-[300px] md:h-[500px] object-contain"
                />
              </div>
              
              {/* Cards dinâmicos baseados nos dados da API */}
              {environmentIndicators.length > 0 ? (
                <>
                  {/* Mobile: cards expandíveis */}
                  <div className="sm:hidden w-full px-1">
                    <div className="space-y-3">
                      {environmentIndicators.map((indicator, index) => (
                        <div key={indicator.id || index}>
                          {renderCompactGenericCard(indicator, 'teal')}
                        </div>
                      ))}
                    </div>
                  </div>
                
                  {/* Desktop: posicionamento dos cards em pontos específicos */}
                  <div className="hidden sm:block">
                    {environmentIndicators.slice(0, 1).map((indicator, index) => (
                      <div key={indicator.id} className="absolute top-0 left-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'teal')}
                      </div>
                    ))}
                    
                    {environmentIndicators.slice(1, 2).map((indicator, index) => (
                      <div key={indicator.id} className="absolute top-0 right-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'teal')}
                      </div>
                    ))}
                    
                    {/* Mostra cards adicionais apenas se existirem */}
                    {environmentIndicators.slice(2, 3).map((indicator, index) => (
                      <div key={indicator.id} className="absolute bottom-0 left-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'teal')}
                      </div>
                    ))}
                    
                    {environmentIndicators.slice(3, 4).map((indicator, index) => (
                      <div key={indicator.id} className="absolute bottom-0 right-0 w-[30%] z-20">
                        {renderGenericCard(indicator, 'teal')}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-teal-100 p-6">
                    <p className="text-teal-800 text-center">{t('locationDetails.noData.environment')}</p>
                  </div>
                </div>
              )}
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
                className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all"
              >
                <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
                  {indicator.title}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <IndicatorIcon className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                    {indicator.value}
                    <span className="text-xs sm:text-sm ml-1 text-gray-500">{indicator.unit}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gráfico ou visualização relacionada à categoria */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-8 bg-green-50 rounded-xl flex flex-col items-center">
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 text-center">
            {activeCategory === 'Comércio' ? t('locationDetails.categoryData.commerce') :
             activeCategory === 'População' ? t('locationDetails.categoryData.population') :
             activeCategory === 'Educação' ? t('locationDetails.categoryData.education') :
             t('locationDetails.categoryData.environment')}
          </h3>
          <p className="text-green-700 text-center text-sm sm:text-base max-w-3xl mb-4 sm:mb-6">
            Este é um indicador composto que resume a performance das cidades gêmeas 
            em relação a outros municípios da região fronteiriça.
          </p>
          <div className="h-8 sm:h-12 w-full max-w-lg bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-green-500 flex items-center justify-end pr-3 text-white text-sm sm:text-base font-medium"
              style={{ width: '65%' }}
            >
              65%
            </div>
          </div>
          <span className="text-xs sm:text-sm text-gray-500">
            Fonte: Dados de pesquisa PIT-T (2023)
          </span>
        </div>
      </>
    );
  };

  // Função de renderização de card específico para indicadores de saúde
  const renderHealthCard = (indicator: HealthIndicator) => {
    if (!indicator) return null;
    
    // Determinar o componente de ícone
    const IconComponent = indicator.icon && typeof indicator.icon !== 'string' 
      ? indicator.icon 
      : Heart;
    
    // Calcular a diferença percentual entre os valores (quando possível)
    let difference = null;
    if (!isNaN(Number(indicator.cityA.value)) && !isNaN(Number(indicator.cityB.value))) {
      const value1 = Number(indicator.cityA.value);
      const value2 = Number(indicator.cityB.value);
      if (value1 > 0 && value2 > 0) {
        difference = ((value2 - value1) / value1) * 100;
      }
    }
    
    const cityA = twinCity?.cityA_name || 'Oiapoque';
    const cityB = twinCity?.cityB_name || 'Saint-Georges';
    
    // Extrair anos das datas de estudo
    const yearStart = extractYear(indicator.study_date_start || '');
    const yearEnd = extractYear(indicator.study_date_end || '');
    
    // Formatar período
    const periodText = yearStart 
      ? (yearEnd && yearStart !== yearEnd) 
        ? `${yearStart} - ${yearEnd}` 
        : yearStart
      : '';
    
    return (
      <div 
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-green-100 p-3 sm:p-4 h-full transform transition-transform duration-300 hover:scale-105"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm sm:text-base font-medium text-green-800">
            {indicator.title}
          </h3>
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-green-500 rounded-full text-white">
            <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        
        {/* Data e fonte com melhor formatação */}
        {(periodText || indicator.source_title) && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 text-xs text-green-600 border-b border-green-100 pb-2">
            {periodText && (
              <div className="flex items-center mb-1 sm:mb-0">
                <span className="mr-1 opacity-70">{t('locationDetails.yearPeriod')}</span>
                <span>{periodText}</span>
              </div>
            )}
            {indicator.source_title && (
              <a 
                href={indicator.source_link || '#'}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-green-800 transition-colors"
              >
                <FileText className="w-3 h-3 mr-1" />
                <span className="underline truncate max-w-[150px] sm:max-w-none">{indicator.source_title}</span>
              </a>
            )}
          </div>
        )}
        
        {indicator.description && (
          <p className="text-xs text-green-600 mb-2 line-clamp-2 sm:line-clamp-none">{indicator.description}</p>
        )}
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-600 mr-1"></div>
              <span className="text-xs font-medium text-green-700">{cityA}</span>
            </div>
            <span className="text-sm font-bold text-green-800">
              {indicator.cityA.value}
              <span className="text-xs ml-1 text-green-600">{indicator.cityA.unit}</span>
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
              <span className="text-xs font-medium text-green-700">{cityB}</span>
            </div>
            <span className="text-sm font-bold text-green-800">
              {indicator.cityB.value}
              <span className="text-xs ml-1 text-green-600">{indicator.cityB.unit}</span>
            </span>
          </div>
          
          {difference !== null && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full text-center ${difference > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {difference > 0 
                ? `${Math.abs(difference).toFixed(1)}% menor em ${cityA}` 
                : `${Math.abs(difference).toFixed(1)}% maior em ${cityA}`}
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
    // Seleciona os dados reais da API conforme a aba ativa
    let data: any[] = [];
    switch(activeTab) {
      case 'livros':
        data = digitalCollection.livros;
        break;
      case 'relatorios':
        data = digitalCollection.relatorios;
        break;
      case 'artigos':
        data = digitalCollection.artigos;
        break;
      case 'outros':
        data = digitalCollection.outros;
        break;
      default:
        data = [];
    }

    // Gerar uma cor baseada na categoria
    const getCategoryColor = (category: string): string => {
      switch(category.toLowerCase()) {
        case 'books':
          return 'bg-blue-500';
        case 'reports':
          return 'bg-teal-500';
        case 'articles':
          return 'bg-amber-500';
        default:
          return 'bg-purple-500';
      }
    };

    // Versão mobile: lista de cards
    const renderMobileList = () => {
      if (data.length === 0) {
        return (
          <div className="bg-white rounded-lg p-4 text-center text-gray-500 shadow-sm border border-gray-100">
            {t('locationDetails.digitalCollection.noDocuments')}
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {data.map((item) => {
            const categoryColor = getCategoryColor(item.category);
            const actionLabel = item.kind === 'external' && item.external_url 
              ? t('locationDetails.digitalCollection.actions.access')
              : item.file_url 
                ? t('locationDetails.digitalCollection.actions.download')
                : t('locationDetails.digitalCollection.actions.unavailable');
            
            const actionColor = actionLabel === t('locationDetails.digitalCollection.actions.unavailable')
              ? 'text-gray-400' 
              : 'text-green-600 hover:text-green-900';

            return (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 flex overflow-hidden">
                {/* Barra lateral colorida */}
                <div className={`${categoryColor} w-2`}></div>
                
                {/* Conteúdo principal */}
                <div className="flex-grow p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 text-sm">{item.title}</h3>
                    
                    {/* Badge com ação */}
                    <a 
                      href={item.external_url || item.file_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`${actionLabel === t('locationDetails.digitalCollection.actions.unavailable') ? 'pointer-events-none' : ''} ${
                        actionLabel === t('locationDetails.digitalCollection.actions.access')
                          ? 'bg-blue-100 text-blue-800'
                          : actionLabel === t('locationDetails.digitalCollection.actions.download')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                      } text-xs px-2 py-1 rounded-full`}
                    >
                      {actionLabel}
                    </a>
                  </div>
                  
                  <div className="mt-1 text-xs text-gray-500 flex items-center">
                    <span className="inline-flex items-center">
                      <FileText className="w-3 h-3 mr-1" /> {item.publication_year || t('locationDetails.digitalCollection.noDate')}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{item.author || t('locationDetails.digitalCollection.unknownAuthor')}</span>
                  </div>
                  
                  <div className="mt-1 text-xs text-gray-400">
                    {translateCategory(item.category)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    // Versão desktop: tabela
    const renderDesktopTable = () => {
      const headers = [
        t('locationDetails.digitalCollection.table.title'),
        t('locationDetails.digitalCollection.table.author'),
        t('locationDetails.digitalCollection.table.year'),
        t('locationDetails.digitalCollection.table.category'),
        t('locationDetails.digitalCollection.table.action')
      ];

      return (
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-green-50">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {data.length === 0 ? (
              <tr><td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">{t('locationDetails.digitalCollection.noDocuments')}</td></tr>
            ) : data.map((item) => (
              <tr key={item.id} className="hover:bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.publication_year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{translateCategory(item.category)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.kind === 'external' && item.external_url ? (
                    <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-900">{t('locationDetails.digitalCollection.actions.access')}</a>
                  ) : item.file_url ? (
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-900">{t('locationDetails.digitalCollection.actions.download')}</a>
                  ) : (
                    <span className="text-gray-400">{t('locationDetails.digitalCollection.actions.unavailable')}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    return (
      <div className="overflow-x-auto">
        {/* Mostrar cards em mobile e tabela em desktop */}
        <div className="block sm:hidden">
          {renderMobileList()}
        </div>
        <div className="hidden sm:block">
          {renderDesktopTable()}
        </div>
      </div>
    );
  };

  const renderGalleries = () => {
    // Nomes das cidades para uso nas galerias
    const cityA = twinCity?.cityA_name || 'Oiapoque';
    const cityB = twinCity?.cityB_name || 'Saint-Georges';
    
    // Mapeamento de cidades para URLs do POTEDES
    const cityUrlMap: { [key: string]: string } = {
      'Oiapoque': 'https://www2.unifap.br/potedes/1-expedicao/localidade-oiapoque/',
      'Saint-Georges': 'https://www2.unifap.br/potedes/1-expedicao/localidade-saint-georges/',
      'Bonfim': 'https://www2.unifap.br/potedes/1-expedicao/localidade-bonfim/',
      'Lethem': 'https://www2.unifap.br/potedes/1-expedicao/localidade-lethem/',
      'Saint-Laurent-du-Maroni': 'https://www2.unifap.br/potedes/1-expedicao/localidade-st-laurent-du-maroni/',
      'Santa Elena de Uairén': 'https://www2.unifap.br/potedes/1-expedicao/localidade-santa-elena-de-uairen/',
      'Pacaraíma': 'https://www2.unifap.br/potedes/1-expedicao/localidade-pacaraima/',
      'Nickerie': 'https://www2.unifap.br/potedes/1-expedicao/localidade-nickerie/',
      'Corriverton': 'https://www2.unifap.br/potedes/1-expedicao/localidade-corriverton/'
    };
    
    // Mapeamento de cidades para imagens
    const cityImageMap: { [key: string]: string } = {
      'Oiapoque': Oiapoque,
      'Saint-Georges': SaintGeorges,
      'Bonfim': Bonfim,
      'Lethem': Lethem,
      'Saint-Laurent-du-Maroni': SaintLaurent,
      'Santa Elena de Uairén': SantaElena,
      'Pacaraíma': Pacaraima,
      'Nickerie': Nickerie,
      'Corriverton': Corriverton
    };
    
    // Mapeamento de cidades para descrições
    const cityDescriptionMap: { [key: string]: string } = {
      'Oiapoque': 'Imagens da cidade de Oiapoque, mostrando seus pontos turísticos, cultura e cotidiano no extremo norte do Brasil.',
      'Saint-Georges': 'A comuna de Saint-Georges-de-l\'Oyapock, sua arquitetura francesa, paisagens amazônicas e cultura local.',
      'Bonfim': 'Bonfim, município de Roraima na fronteira com a Guiana, mostrando o comércio fronteiriço e a ponte internacional.',
      'Lethem': 'Lethem, importante centro comercial da Guiana na fronteira com o Brasil, sua cultura diversificada e arquitetura colonial.',
      'Saint-Laurent-du-Maroni': 'Saint-Laurent-du-Maroni, antiga cidade penitenciária, hoje patrimônio histórico e cultural da Guiana Francesa.',
      'Santa Elena de Uairén': 'Santa Elena de Uairén, porta de entrada venezuelana ao Monte Roraima e rica diversidade cultural indígena.',
      'Pacaraíma': 'Pacaraíma, município brasileiro na fronteira com a Venezuela, conhecido pela proximidade com o Monte Roraima.',
      'Nickerie': 'Nickerie, centro agrícola do oeste surinamês, conhecido pela produção de arroz e comércio regional.',
      'Corriverton': 'Corriverton, cidade costeira da Guiana, importante centro comercial e pesqueiro na foz do rio Berbice.'
    };
    
    // Função para abrir galeria no POTEDES
    const openGallery = (cityName: string) => {
      const url = cityUrlMap[cityName];
      if (url) {
        window.open(url, '_blank');
      }
    };
    
    // Obter dados das cidades atuais
    const cityAImage = cityImageMap[cityA] || Oiapoque;
    const cityBImage = cityImageMap[cityB] || SaintGeorges;
    const cityADescription = cityDescriptionMap[cityA] || `Imagens da cidade de ${cityA}, mostrando seus pontos turísticos, cultura e cotidiano.`;
    const cityBDescription = cityDescriptionMap[cityB] || `A comuna de ${cityB}, sua arquitetura, paisagens e cultura local.`;
    
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('locationDetails.galleries.imageGalleries')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <div 
            className="relative rounded-xl overflow-hidden shadow-lg h-48 sm:h-64 md:h-96"
            style={{ 
              backgroundImage: `url(${cityAImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{cityA}</h3>
              {/*<p className="text-xs sm:text-sm md:text-base text-white/90 mb-2 sm:mb-4">{cityADescription}</p>*/}
              <button 
                onClick={() => openGallery(cityA)}
                className="w-full mt-1 sm:mt-2 py-1.5 sm:py-2 sm:py-3 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                {t('locationDetails.galleries.viewGalleryButton')}
              </button>
            </div>
          </div>

          <div 
            className="relative rounded-xl overflow-hidden shadow-lg h-48 sm:h-64 md:h-96"
            style={{ 
              backgroundImage: `url(${cityBImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{cityB}</h3>
              {/*<p className="text-xs sm:text-sm md:text-base text-white/90 mb-2 sm:mb-4">{cityBDescription}</p>*/}
              <button 
                onClick={() => openGallery(cityB)}
                className="w-full mt-1 sm:mt-2 py-1.5 sm:py-2 sm:py-3 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                {t('locationDetails.galleries.viewGalleryButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Adicionar novos métodos de renderização para cards compactos
  const renderCompactHealthCard = (indicator: HealthIndicator) => {
    if (!indicator) return null;
    
    // Determinar o componente de ícone
    const IconComponent = indicator.icon && typeof indicator.icon !== 'string' 
      ? indicator.icon 
      : Heart;
    
    // Nomes das cidades
    const cityA = twinCity?.cityA_name || 'Oiapoque';
    const cityB = twinCity?.cityB_name || 'Saint-Georges';
    
    // ID único para o card
    const cardId = `health-${indicator.id}`;
    
    // Verificar se o card está expandido
    const isExpanded = expandedCards[cardId] || false;
    
    // Função para alternar estado de expansão
    const toggleExpand = () => {
      setExpandedCards(prev => ({
        ...prev,
        [cardId]: !prev[cardId]
      }));
    };
    
    // Extrair anos das datas de estudo
    const yearStart = extractYear(indicator.study_date_start || '');
    const yearEnd = extractYear(indicator.study_date_end || '');
    
    // Formatar período
    const periodText = yearStart 
      ? (yearEnd && yearStart !== yearEnd) 
        ? `${yearStart} - ${yearEnd}` 
        : yearStart
      : '';
    
    return (
      <div 
        className={`
          bg-white rounded-xl shadow-md border border-green-100 
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'shadow-lg' : 'shadow-sm'}
          mb-3
        `}
      >
        {/* Cabeçalho clicável do card - sempre visível */}
        <div 
          className="flex items-start px-3 py-3 cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="flex-shrink-0 mr-3">
            <div className="w-9 h-9 flex items-center justify-center bg-green-100 rounded-full">
              <IconComponent className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          <div className="flex-grow mr-2">
            <h3 className="text-sm leading-snug font-medium text-green-800">
              {indicator.title}
            </h3>
          </div>
          
          <div 
            className={`
              w-7 h-7 rounded-full bg-green-50 flex items-center justify-center 
              transition-transform duration-300 flex-shrink-0 
              ${isExpanded ? 'rotate-180' : ''}
            `}
          >
            <svg 
              className="w-4 h-4 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Conteúdo expandido */}
        <div 
          className={`
            overflow-hidden transition-all duration-300 ease-in-out bg-green-50/50
            ${isExpanded ? 'max-h-[300px] opacity-100 pt-0 px-3 pb-3 border-t border-green-100' : 'max-h-0 opacity-0 p-0 border-t-0'}
          `}
        >
          {/* Período e fonte */}
          {(periodText || indicator.source_title) && (
            <div className="flex flex-wrap items-center justify-between py-2 text-xs text-green-600 border-b border-green-100/70">
              {periodText && (
                <div className="flex items-center">
                  <span className="mr-1 opacity-70">{t('locationDetails.yearPeriod')}</span>
                  <span className="font-medium">{periodText}</span>
                </div>
              )}
              {indicator.source_title && (
                <a 
                  href={indicator.source_link || '#'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-green-800 transition-colors"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  <span className="underline truncate max-w-[180px]">{indicator.source_title}</span>
                </a>
              )}
            </div>
          )}
        
          {/* Descrição */}
          {indicator.description && (
            <p className="text-xs text-green-600 py-2 border-b border-green-100/70">{indicator.description}</p>
          )}
          
          {/* Valores das cidades */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-white rounded-lg p-2 border border-green-100">
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 rounded-full bg-green-600 mr-1"></div>
                <span className="text-xs font-medium text-green-700">{cityA}</span>
              </div>
              <div className="text-base font-bold text-green-800">
                {indicator.cityA.value}
                <span className="text-xs ml-1 text-green-600">{indicator.cityA.unit}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-2 border border-green-100">
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                <span className="text-xs font-medium text-green-700">{cityB}</span>
              </div>
              <div className="text-base font-bold text-green-800">
                {indicator.cityB.value}
                <span className="text-xs ml-1 text-green-600">{indicator.cityB.unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCompactGenericCard = (indicator: ComparativeIndicator, color: 'blue' | 'amber' | 'emerald' | 'teal') => {
    if (!indicator) return null;
    
    // Determinar o componente de ícone
    const IconComponent = indicator.icon && typeof indicator.icon !== 'string' 
      ? indicator.icon 
      : Heart;
    
    // Nomes das cidades
    const cityA = twinCity?.cityA_name || 'Cidade A';
    const cityB = twinCity?.cityB_name || 'Cidade B';
    
    // ID único para o card
    const cardId = `${color}-${indicator.id}`;
    
    // Verificar se o card está expandido
    const isExpanded = expandedCards[cardId] || false;
    
    // Função para alternar estado de expansão
    const toggleExpand = () => {
      setExpandedCards(prev => ({
        ...prev,
        [cardId]: !prev[cardId]
      }));
    };
    
    // Classes baseadas na cor
    const textColor = `text-${color}-800`;
    const bgColor = `bg-${color}-500`;
    const iconBgColor = `bg-${color}-100`;
    const iconColor = `text-${color}-600`;
    const borderColor = `border-${color}-100`;
    const descriptionColor = `text-${color}-600`;
    const expandedBgColor = `bg-${color}-50/50`;
    
    // Extrair anos das datas de estudo
    const yearStart = extractYear(indicator.study_date_start || '');
    const yearEnd = extractYear(indicator.study_date_end || '');
    
    // Formatar período
    const periodText = yearStart 
      ? (yearEnd && yearStart !== yearEnd) 
        ? `${yearStart} - ${yearEnd}` 
        : yearStart
      : '';
    
    return (
      <div 
        className={`
          bg-white rounded-xl shadow-md ${borderColor}
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'shadow-lg' : 'shadow-sm'}
          mb-3
        `}
      >
        {/* Cabeçalho clicável do card - sempre visível */}
        <div 
          className="flex items-start px-3 py-3 cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="flex-shrink-0 mr-3">
            <div className={`w-9 h-9 flex items-center justify-center ${iconBgColor} rounded-full`}>
              <IconComponent className={`w-5 h-5 ${iconColor}`} />
            </div>
          </div>
          
          <div className="flex-grow mr-2">
            <h3 className={`text-sm leading-snug font-medium ${textColor}`}>
              {indicator.title}
            </h3>
          </div>
          
          <div 
            className={`
              w-7 h-7 rounded-full ${iconBgColor} flex items-center justify-center 
              transition-transform duration-300 flex-shrink-0
              ${isExpanded ? 'rotate-180' : ''}
            `}
          >
            <svg 
              className={`w-4 h-4 ${iconColor}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Conteúdo expandido */}
        <div 
          className={`
            overflow-hidden transition-all duration-300 ease-in-out ${expandedBgColor}
            ${isExpanded ? 'max-h-[300px] opacity-100 pt-0 px-3 pb-3 border-t' : 'max-h-0 opacity-0 p-0 border-t-0'} ${borderColor}
          `}
        >
          {/* Período e fonte */}
          {(periodText || indicator.source_title) && (
            <div className={`flex flex-wrap items-center justify-between py-2 text-xs ${descriptionColor} border-b ${borderColor}/70`}>
              {periodText && (
                <div className="flex items-center">
                  <span className="mr-1 opacity-70">{t('locationDetails.yearPeriod')}</span>
                  <span className="font-medium">{periodText}</span>
                </div>
              )}
              {indicator.source_title && (
                <a 
                  href={indicator.source_link || '#'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center hover:${textColor} transition-colors`}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  <span className="underline truncate max-w-[180px]">{indicator.source_title}</span>
                </a>
              )}
            </div>
          )}
        
          {/* Descrição */}
          {indicator.description && (
            <p className={`text-xs ${descriptionColor} py-2 border-b ${borderColor}/70`}>{indicator.description}</p>
          )}
          
          {/* Valores das cidades */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className={`bg-white rounded-lg p-2 border ${borderColor}`}>
              <div className="flex items-center mb-1">
                <div className={`w-2 h-2 rounded-full bg-${color}-600 mr-1`}></div>
                <span className={`text-xs font-medium ${descriptionColor}`}>{cityA}</span>
              </div>
              <div className={`text-base font-bold ${textColor}`}>
                {indicator.cityA.value}
                <span className={`text-xs ml-1 ${descriptionColor}`}>{indicator.cityA.unit}</span>
              </div>
            </div>
            
            <div className={`bg-white rounded-lg p-2 border ${borderColor}`}>
              <div className="flex items-center mb-1">
                <div className={`w-2 h-2 rounded-full bg-${color}-400 mr-1`}></div>
                <span className={`text-xs font-medium ${descriptionColor}`}>{cityB}</span>
              </div>
              <div className={`text-base font-bold ${textColor}`}>
                {indicator.cityB.value}
                <span className={`text-xs ml-1 ${descriptionColor}`}>{indicator.cityB.unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Adicionar estilos CSS para ocultar a scrollbar mas manter a funcionalidade
  const animationStylesUpdated = `
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
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes pulse-subtle {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
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
    .animate-shimmer-slow {
      animation: shimmer 5s ease-in-out infinite;
    }
    .animate-pulse-subtle {
      animation: pulse-subtle 2s ease-in-out infinite;
    }
    .active\\:scale-95:active {
      transform: scale(0.95);
    }
    .active\\:scale-98:active {
      transform: scale(0.98);
    }
    .hover\\:scale-102:hover {
      transform: scale(1.02);
    }
    .hide-scrollbar {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;  /* Chrome, Safari, Opera */
    }
  `;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
          <div className="text-xl text-gray-600">{t('locationDetails.loading')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">{t('locationDetails.error.title')}</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              {t('locationDetails.error.backButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-700 mb-2">{t('locationDetails.notFound.title')}</h2>
          <p className="text-amber-600 mb-6">
            {t('locationDetails.notFound.message')}
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              {t('locationDetails.notFound.backButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header com design moderno representando cidades gêmeas */}
      <div className="relative h-auto min-h-[28rem] md:h-96 overflow-hidden mb-6 bg-gradient-to-r from-green-900 via-green-1200 to-blue-600 py-8 md:py-0">
        {/* Elementos de design abstratos para simbolizar cidades e conexão */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Elementos gráficos do lado esquerdo (primeira cidade) */}
          <div className="absolute top-20 left-10 md:left-20 w-16 h-16 md:w-40 md:h-40 rounded-xl bg-white/10 backdrop-blur-md transform rotate-12 animate-float"></div>
          <div className="absolute top-10 left-16 md:left-32 w-8 h-8 md:w-24 md:h-24 rounded-lg bg-white/15 backdrop-blur-md transform -rotate-6 animate-float-slow"></div>
          <div className="absolute bottom-10 left-12 md:left-40 w-12 h-12 md:w-28 md:h-28 rounded-lg bg-white/10 backdrop-blur-md transform rotate-45 animate-float-medium"></div>
          
          {/* Linha central conectando as cidades */}
          <div className="absolute left-1/2 top-1/2 w-4/5 h-1 bg-white/10 backdrop-blur-md transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-1/2 w-10 h-10 rounded-full bg-white/600 backdrop-blur-md transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          
          {/* Elementos gráficos do lado direito (segunda cidade) */}
          <div className="absolute top-16 right-10 md:right-20 w-16 h-16 md:w-40 md:h-40 rounded-xl bg-white/10 backdrop-blur-md transform -rotate-12 animate-float-slow"></div>
          <div className="absolute top-6 right-16 md:right-32 w-8 h-8 md:w-24 md:h-24 rounded-lg bg-white/15 backdrop-blur-md transform rotate-6 animate-float"></div>
          <div className="absolute bottom-10 right-12 md:right-40 w-12 h-12 md:w-28 md:h-28 rounded-lg bg-white/10 backdrop-blur-md transform -rotate-45 animate-float-medium"></div>
        </div>
        
        {/* Conteúdo do header */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-4 pb-8 sm:py-0">
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-medium mb-3 sm:mb-3">
            Cidades Transfronteiriças
          </span>
          <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-2 tracking-tight drop-shadow-lg">
            Cidades Gêmeas
          </h1>
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-xl md:text-3xl font-bold text-white/90 drop-shadow-lg">
              {twinCity?.cityA_name || 'Cidade A'}
            </h2>
            <div className="mx-2 sm:mx-4 w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h2 className="text-base sm:text-xl md:text-3xl font-bold text-white/90 drop-shadow-lg">
              {twinCity?.cityB_name || 'Cidade B'}
            </h2>
          </div>
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-3xl drop-shadow-lg">
            {twinCity?.description || 'Dados sobre saúde, população, desenvolvimento socioeconômico, educação e meio ambiente'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Menu de navegação responsivo com efeito glassmorphism */}
        <div className="mb-8 sticky top-0 z-30 pt-2 pb-3 bg-gradient-to-r from-white/80 to-white/90 backdrop-blur-xl shadow-lg -mx-4 px-4 border-b border-white/20">
          {/* Versão mobile: sistema de acordeão */}
          <div className="md:hidden max-w-sm mx-auto">
            {/* Botão ativo que mostra a categoria selecionada */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`
                flex items-center justify-between w-full px-5 py-3.5 
                bg-gradient-to-r from-white/80 to-white/90 backdrop-blur-2xl 
                rounded-2xl shadow-md border border-white/50
                transition-all duration-300 ease-in-out
                ${mobileMenuOpen ? 'rounded-b-none shadow-lg' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                {(() => {
                  // Função para determinar o ícone e a cor da categoria ativa
                  let IconComponent;
                  let iconColor;
                  
                  switch(activeCategory) {
                    case 'Saúde':
                      IconComponent = Heart;
                      iconColor = 'text-green-600';
                      break;
                    case 'População':
                      IconComponent = Users;
                      iconColor = 'text-blue-600';
                      break;
                    case 'Comércio':
                      IconComponent = TrendingUp;
                      iconColor = 'text-amber-600';
                      break;
                    case 'Educação':
                      IconComponent = GraduationCap;
                      iconColor = 'text-emerald-600';
                      break;
                    case 'Meio Ambiente':
                      IconComponent = Leaf;
                      iconColor = 'text-teal-600';
                      break;
                    default:
                      IconComponent = Heart;
                      iconColor = 'text-green-600';
                  }
                  
                  return (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconColor.replace('text-', 'bg-').replace('600', '100')}`}>
                      <IconComponent className={`w-5 h-5 ${iconColor}`} />
                    </div>
                  );
                })()}
                <span className="font-semibold text-gray-800">{activeCategory}</span>
              </div>
              <div className={`w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center transition-transform duration-300 ${mobileMenuOpen ? 'rotate-180' : ''}`}>
                <svg 
                  className="w-4 h-4 text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {/* Acordeão expandido */}
            <div 
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                bg-gradient-to-b from-white/90 to-white/80 backdrop-blur-xl
                rounded-b-2xl shadow-lg border-x border-b border-white/50
                ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
              `}
            >
              {categories.map((category, index) => {
                const CategoryIcon = category.icon;
                const isActive = activeCategory === category.id;
                
                // Determine as cores com base na categoria
                let bgColor = '';
                let iconBgColor = '';
                let iconColor = '';
                let textColor = '';
                
                switch(category.id) {
                  case 'Saúde': 
                    iconBgColor = 'bg-green-100';
                    iconColor = 'text-green-600';
                    textColor = 'text-green-800';
                    bgColor = isActive ? 'bg-green-50' : '';
                    break;
                  case 'População': 
                    iconBgColor = 'bg-blue-100';
                    iconColor = 'text-blue-600';
                    textColor = 'text-blue-800';
                    bgColor = isActive ? 'bg-blue-50' : '';
                    break;
                  case 'Comércio': 
                    iconBgColor = 'bg-amber-100';
                    iconColor = 'text-amber-600';
                    textColor = 'text-amber-800';
                    bgColor = isActive ? 'bg-amber-50' : '';
                    break;
                  case 'Educação': 
                    iconBgColor = 'bg-emerald-100';
                    iconColor = 'text-emerald-600';
                    textColor = 'text-emerald-800';
                    bgColor = isActive ? 'bg-emerald-50' : '';
                    break;
                  case 'Meio Ambiente': 
                    iconBgColor = 'bg-teal-100';
                    iconColor = 'text-teal-600';
                    textColor = 'text-teal-800';
                    bgColor = isActive ? 'bg-teal-50' : '';
                    break;
                }
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setTimeout(() => setMobileMenuOpen(false), 300);
                    }}
                    className={`
                      flex items-center gap-3 px-5 py-3.5 w-full
                      ${bgColor}
                      ${index !== categories.length - 1 ? 'border-b border-gray-100' : ''}
                      active:scale-98 transition-all duration-150
                    `}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBgColor}`}>
                      <CategoryIcon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <span className={`font-medium ${textColor}`}>
                      {category.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Versão desktop: menu horizontal com efeito glassmorphism */}
          <div className="hidden md:flex justify-center">
            <div className="bg-gradient-to-r from-white/70 via-white/50 to-white/70 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-white/30 inline-flex gap-1 sm:gap-1.5 relative overflow-hidden">
              {/* Efeito de reflexo */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-[400px] opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -rotate-45 animate-shimmer-slow"></div>
              </div>

              {/* Linha de "piso" com reflexo */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              
              {categories.map((category, index) => {
                const CategoryIcon = category.icon;
                const isActive = activeCategory === category.id;
                
                // Determinar cores e estilos para cada categoria
                let bgGradient = '';
                let textColor = '';
                let hoverEffect = '';
                let transitionEffect = '';
                let shadowEffect = '';
                
                switch(category.id) {
                  case 'Saúde':
                    bgGradient = isActive ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-white/50';
                    textColor = isActive ? 'text-white' : 'text-green-700';
                    hoverEffect = !isActive ? 'hover:bg-green-50 hover:bg-opacity-80' : '';
                    transitionEffect = 'transform-gpu transition-all duration-300 ease-out';
                    shadowEffect = isActive ? 'shadow-lg shadow-green-200/50' : '';
                    break;
                  case 'População':
                    bgGradient = isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-white/50';
                    textColor = isActive ? 'text-white' : 'text-blue-700';
                    hoverEffect = !isActive ? 'hover:bg-blue-50 hover:bg-opacity-80' : '';
                    transitionEffect = 'transform-gpu transition-all duration-300 ease-out';
                    shadowEffect = isActive ? 'shadow-lg shadow-blue-200/50' : '';
                    break;
                  case 'Comércio':
                    bgGradient = isActive ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-white/50';
                    textColor = isActive ? 'text-white' : 'text-amber-700';
                    hoverEffect = !isActive ? 'hover:bg-amber-50 hover:bg-opacity-80' : '';
                    transitionEffect = 'transform-gpu transition-all duration-300 ease-out';
                    shadowEffect = isActive ? 'shadow-lg shadow-amber-200/50' : '';
                    break;
                  case 'Educação':
                    bgGradient = isActive ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-white/50';
                    textColor = isActive ? 'text-white' : 'text-emerald-700';
                    hoverEffect = !isActive ? 'hover:bg-emerald-50 hover:bg-opacity-80' : '';
                    transitionEffect = 'transform-gpu transition-all duration-300 ease-out';
                    shadowEffect = isActive ? 'shadow-lg shadow-emerald-200/50' : '';
                    break;
                  case 'Meio Ambiente':
                    bgGradient = isActive ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-white/50';
                    textColor = isActive ? 'text-white' : 'text-teal-700';
                    hoverEffect = !isActive ? 'hover:bg-teal-50 hover:bg-opacity-80' : '';
                    transitionEffect = 'transform-gpu transition-all duration-300 ease-out';
                    shadowEffect = isActive ? 'shadow-lg shadow-teal-200/50' : '';
                    break;
                }
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`
                      relative z-10
                      flex items-center gap-2 px-4 py-2.5 
                      backdrop-blur-sm rounded-xl border border-white/30
                      ${bgGradient} ${textColor} ${hoverEffect} ${shadowEffect}
                      ${transitionEffect}
                      ${isActive ? 'scale-105' : 'hover:scale-102'}
                      active:scale-95
                    `}
                  >
                    {/* Reflexo no topo do botão */}
                    {isActive && (
                      <div className="absolute inset-x-0 top-0 h-px bg-white/50"></div>
                    )}
                    
                    <CategoryIcon className={`w-5 h-5 ${isActive ? 'animate-pulse-subtle' : ''}`} />
                    <span className="font-medium select-none">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conteúdo principal - terceira linha com o layout redesenhado */}
        <div className="mb-8 sm:mb-12">
          {renderCategoryContent()}
        </div>
        
        {/* Quarta linha - Acervo Digital */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 text-center mb-4 sm:mb-8">
            {t('locationDetails.digitalCollection.title')}
          </h2>
          
          {/* Tabs - Versão mobile: Dropdown selector */}
          <div className="sm:hidden mb-4">
            <select 
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 bg-white text-green-700 border border-green-200 rounded-lg shadow-sm"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {t(`locationDetails.digitalCollection.tabs.${tab.id}`)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Tabs - Versão desktop: Botões horizontais */}
          <div className="hidden sm:flex justify-center mb-4">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-green-500 text-white' : 'bg-white text-green-700 hover:bg-green-100'}`}
                >
                  <TabIcon className="w-5 h-5" />
                  {t(`locationDetails.digitalCollection.tabs.${tab.id}`)}
              </button>
              );
            })}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6 overflow-hidden">
            <div className="overflow-x-auto -mx-2 px-2">
              {renderDigitalCollectionContent()}
            </div>
          </div>
        </div>

        {/* Quinta linha - Galerias */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 text-center mb-4 sm:mb-8">
            {t('locationDetails.galleries.title')}
          </h2>
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
            {renderGalleries()}
          </div>
        </div>

      </div>
      
      {/* Aplicar estilos de animação usando style convencional do React */}
      <style dangerouslySetInnerHTML={{ __html: animationStylesUpdated }} />
    </div>
  );
};

export default LocationDetails;