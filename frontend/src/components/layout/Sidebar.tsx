import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookCopy, Users, Camera, Map, X, Menu, LogIn, Globe, ChevronDown, ChevronRight, MapPin } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Interface para as cidades gêmeas
interface TwinCity {
  id: number;
  cityA_name: string;
  cityB_name: string;
}

const Sidebar = () => {
  const [twinCitiesExpanded, setTwinCitiesExpanded] = useState(false);
  const [twinCities, setTwinCities] = useState<TwinCity[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  // Fechar a sidebar quando a rota mudar (navegação entre páginas)
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  // Função para buscar cidades gêmeas da API
  useEffect(() => {
    const fetchTwinCities = async () => {
      try {
        setLoading(true);
        const response = await api.get('/twin-cities');
        if (response.data) {
          setTwinCities(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar cidades gêmeas:', error);
        // Em caso de falha, adicionar dados mockados para demonstração
        setTwinCities([
          { id: 1, cityA_name: 'Oiapoque', cityB_name: 'Saint-Georges' },
          { id: 2, cityA_name: 'Tabatinga', cityB_name: 'Leticia' },
          { id: 3, cityA_name: 'Foz do Iguaçu', cityB_name: 'Ciudad del Este' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTwinCities();
  }, []);

  // Lidar com cliques externos para fechar a sidebar no mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      const menuButton = document.querySelector('.menu-button');
      if (
        sidebar && 
        !sidebar.contains(e.target as Node) && 
        menuButton && 
        !menuButton.contains(e.target as Node) && 
        window.innerWidth < 768
      ) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Adicionar classe css 'sidebar-closed' ao corpo do documento em dispositivos móveis
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        document.body.classList.add('sidebar-closed');
      } else {
        document.body.classList.remove('sidebar-closed');
      }
    };

    // Inicializar o estado
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && window.innerWidth < 768) {
      sidebar.classList.remove('sidebar-open');
    }
  };

  const toggleTwinCities = () => {
    setTwinCitiesExpanded(!twinCitiesExpanded);
  };

  const menuItems = [
    { to: "/", icon: Home, text: t('menu.home') },
    { to: "/acervo", icon: BookCopy, text: t('menu.digitalCollection') },
    { to: "/colabore", icon: Users, text: t('menu.collaborate') },
    { to: "/galeria", icon: Camera, text: t('menu.gallery') },
  ];

  // Verificar se estamos na página Home
  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* Botão de menu para todas as páginas exceto a Home */}
      {!isHomePage && (
        <button
          onClick={() => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
              sidebar.classList.toggle('sidebar-open');
            }
          }}
          className="menu-button fixed top-4 left-4 z-50 p-2 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full md:hidden hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-md"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed top-0 left-0 h-screen w-56 lg:w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white transform transition-all duration-300 ease-in-out z-40 shadow-xl flex flex-col md:translate-x-0`}
      >
        {/* Logo e header */}
        <div className="relative">
          {/* Elementos decorativos de fundo */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-green-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>
          
          <div className="relative p-3 md:p-4 border-b border-emerald-700/50">
            <div className="flex items-center justify-between md:block">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-md mx-auto">
                <Map className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <button
                onClick={closeSidebar}
                className="md:hidden text-white/80 hover:text-white transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-center mt-2 md:mt-3 tracking-wide">PIT-T</h1>
            <p className="text-xs text-center mt-1 text-emerald-100/80 max-w-[200px] mx-auto">
              Plataforma Interativa de Tipologias Transfronteiriças
            </p>
            <div className="mt-3 md:mt-4">
              <p className="text-xs text-center text-emerald-200/80 mb-1">{t('languageSelector')}</p>
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* Links de navegação */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1 md:space-y-2">
            {/* Item Home (primeiro item) */}
            <li>
              <NavLink
                to="/"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center p-2 md:p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md' 
                      : 'text-white/80 hover:bg-emerald-700/50 hover:text-white'
                  }`
                }
              >
                <Home className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 transition-all duration-200" />
                <span className="text-sm font-medium truncate">{t('menu.home')}</span>
              </NavLink>
            </li>
            
            {/* Item de menu para cidades gêmeas com submenu (segundo item) */}
            <li>
              <button
                onClick={toggleTwinCities}
                className="w-full flex items-center justify-between p-2 md:p-3 rounded-lg transition-all duration-200 text-white/80 hover:bg-emerald-700/50 hover:text-white"
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 transition-all duration-200" />
                  <span className="text-sm font-medium">Cidades Gêmeas</span>
                </div>
                {twinCitiesExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {/* Submenu para cidades gêmeas */}
              {twinCitiesExpanded && (
                <div className="mt-1 ml-3 pl-6 border-l border-emerald-700/50 space-y-1">
                  {loading ? (
                    <div className="py-2 px-3 text-xs text-emerald-100/60">Carregando...</div>
                  ) : twinCities.length > 0 ? (
                    twinCities.map(city => (
                      <NavLink
                        key={city.id}
                        to={`/location/${city.id}`}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                          `block py-1.5 px-2 rounded-md text-xs transition-colors ${
                            isActive
                              ? 'bg-emerald-700 text-white'
                              : 'text-emerald-100/80 hover:bg-emerald-700/30 hover:text-white'
                          }`
                        }
                      >
                        {city.cityA_name} - {city.cityB_name}
                      </NavLink>
                    ))
                  ) : (
                    <div className="py-2 px-3 text-xs text-emerald-100/60">Nenhuma cidade encontrada</div>
                  )}
                </div>
              )}
            </li>
            
            {/* Demais items de menu */}
            {menuItems.slice(1).map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center p-2 md:p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md' 
                        : 'text-white/80 hover:bg-emerald-700/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 transition-all duration-200" />
                  <span className="text-sm font-medium truncate">{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer da sidebar */}
        <div className="p-2 border-t border-emerald-700/50 bg-emerald-900/50 flex-shrink-0">
          {isAuthenticated ? (
            <button
              onClick={() => {
                closeSidebar();
                logout();
              }}
              className="flex items-center px-2 py-1.5 rounded-lg text-white/70 hover:bg-emerald-700/50 hover:text-white transition-all duration-200 w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span className="text-xs md:text-sm font-medium">{t('Sair')}</span>
            </button>
          ) : (
            <Link
              //to="/auth?force=true"
              to="/auth"
              className="flex items-center px-2 py-1.5 rounded-lg text-white/70 hover:bg-emerald-700/50 hover:text-white transition-all duration-200"
              onClick={closeSidebar}
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span className="text-xs md:text-sm font-medium">{t('Entrar')}</span>
            </Link>
          )}
          
          <div className="pt-1 border-t border-emerald-700/30 mt-1">
            <div className="flex items-center justify-center">
              <Globe className="w-3 h-3 text-emerald-400/60 mr-1" />
              <span className="text-xs text-emerald-300/60">PIT-T</span>
            </div>
            <p className="text-xs text-emerald-200/60 text-center text-[10px]">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;