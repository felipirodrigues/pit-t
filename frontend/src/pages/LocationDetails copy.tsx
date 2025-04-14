import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, TrendingUp, Image, BookOpen, FileText, ScrollText, Files, Download, ExternalLink } from 'lucide-react';
import axios from 'axios';

interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  country: string;
  image_url?: string;
}

interface Indicator {
  id: number;
  location_id: number;
  title: string;
  value: string;
  unit?: string;
}

const LocationDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [activeTab, setActiveTab] = useState('books');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        const [locationResponse, indicatorsResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/locations/${id}`),
          axios.get(`http://localhost:3000/api/indicators?location_id=${id}`)
        ]);

        setLocation(locationResponse.data);
        const locationIndicators = indicatorsResponse.data.filter(
          (indicator: Indicator) => indicator.location_id === Number(id)
        );
        setIndicators(locationIndicators);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLocationData();
    }
  }, [id]);

  const tabs = [
    { id: 'books', label: t('locationDetails.digitalCollection.tabs.books'), icon: BookOpen },
    { id: 'reports', label: t('locationDetails.digitalCollection.tabs.reports'), icon: FileText },
    { id: 'articles', label: t('locationDetails.digitalCollection.tabs.articles'), icon: ScrollText },
    { id: 'others', label: t('locationDetails.digitalCollection.tabs.others'), icon: Files }
  ];

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
    <div className="w-full">
      {/* Header */}
      <div 
        className="relative h-48 md:h-80 rounded-xl overflow-hidden mb-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${location.image_url ? `http://localhost:3000${location.image_url}` : '/placeholder-image.jpg'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
              {location.name}
            </h1>
            <p className="text-sm md:text-xl max-w-2xl mx-auto">
              {location.description}
            </p>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <section className="mb-8 md:mb-16">
        <div className="flex items-center mb-4 md:mb-6">
          <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
          <h2 className="text-xl md:text-2xl font-bold">{t('locationDetails.indicators.title')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {indicators.map((indicator) => (
            <div 
              key={indicator.id}
              className="bg-white rounded-lg p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-gray-600 text-sm md:text-base mb-2">
                {indicator.title}
              </h3>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                {indicator.value} {indicator.unit}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Acervo Digital */}
      <section className="mb-8 md:mb-16">
        <div className="flex items-center mb-4 md:mb-6">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
          <h2 className="text-xl md:text-2xl font-bold">{t('locationDetails.digitalCollection.title')}</h2>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="flex space-x-4 md:space-x-8 min-w-max">
            {tabs.map(({ id: tabId, label, icon: Icon }) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tabId
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Em breve */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">
            Acervo digital em desenvolvimento. Em breve você poderá acessar documentos, relatórios e publicações sobre esta localidade.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LocationDetails;