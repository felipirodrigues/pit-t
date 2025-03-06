import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Location {
  id: number;
  name: string;
  country: string;
}

interface RightSidebarProps {
  className?: string;
}

const RightSidebar = ({ className = '' }: RightSidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Erro ao buscar localidades:', error);
      }
    };

    fetchLocations();
  }, []);

  const getCountryFlag = (country: string): string => {
    const flags: { [key: string]: string } = {
      'Brasil': 'http://localhost:3000/uploads/locations/bd-brasil.png',
      'Guiana': 'http://localhost:3000/uploads/locations/bd-guiana.png',
      'Guiana Francesa': 'http://localhost:3000/uploads/locations/bd-guianaf.png',
      'Venezuela': 'http://localhost:3000/uploads/locations/bd-venezuela.png'
    };
    return flags[country] || flags['Brasil'];
  };

  const handleLocationClick = (locationId: number) => {
    navigate(`/location/${locationId}`);
    setIsOpen(false);
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Botão Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-forest-green text-white rounded-full p-4 shadow-lg hover:bg-forest-green/90 transition-colors"
      >
        <MapPin className="w-6 h-6" />
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Desktop */}
      <aside 
        className={`
          fixed z-50 bg-dark-green/80 backdrop-blur-sm
          hidden md:block
          w-80 right-0 top-0 h-screen border-l border-white/10
          ${className}
        `}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Buscador */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Buscar localidade</h2>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome da localidade..."
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-white/50 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Localidades */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Cidades em foco</h2>
            <div className="grid grid-cols-3 gap-3">
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationClick(location.id)}
                  className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden mb-2">
                    <img
                      src={getCountryFlag(location.country)}
                      alt={`Bandeira - ${location.country}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-white text-sm">{location.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Versão Mobile do Sidebar */}
      <div 
        className={`
          md:hidden fixed z-50 bg-dark-green/80 backdrop-blur-sm
          w-full h-[85vh] bottom-0 left-0 border-t border-white/10 rounded-t-3xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Indicador de arraste */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

          {/* Botão fechar */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Conteúdo igual ao desktop */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Buscar localidade</h2>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome da localidade..."
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-white/50 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Cidades em foco</h2>
            <div className="grid grid-cols-3 gap-3">
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationClick(location.id)}
                  className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden mb-2">
                    <img
                      src={getCountryFlag(location.country)}
                      alt={`Bandeira - ${location.country}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-white text-sm">{location.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar; 