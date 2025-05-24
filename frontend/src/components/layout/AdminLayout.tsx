import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  MapPin,
  Map,
  TrendingUp,
  Image,
  BookOpen,
  Users,
  MessageSquare,
  FileBarChart,
  Menu,
  X,
  LogOut,
  Globe,
  GitBranch
} from 'lucide-react';

const AdminLayout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    //{ path: '/admin', icon: LayoutDashboard, label: t('admin.menu.dashboard') },
    //{ path: '/admin/locations', icon: MapPin, label: t('admin.menu.locations') },
    { path: '/admin/twin-cities', icon: GitBranch, label: 'Cidades Gêmeas' },
    { path: '/admin/indicators', icon: TrendingUp, label: t('admin.menu.indicators') },
    { path: '/admin/gallery', icon: Image, label: t('admin.menu.gallery') },
    { path: '/admin/collection', icon: BookOpen, label: t('admin.menu.collection') },
    { path: '/admin/users', icon: Users, label: t('admin.menu.users') },
    { path: '/admin/collaboration', icon: MessageSquare, label: t('admin.menu.collaboration') },
    //{ path: '/admin/reports', icon: FileBarChart, label: t('admin.menu.reports') }
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-56 lg:w-64 h-screen bg-gradient-to-b from-emerald-800 to-emerald-900 text-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo e cabeçalho */}
        <div className="relative overflow-hidden flex-shrink-0">
          {/* Elementos decorativos de fundo */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-green-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>
          
          <div className="relative p-2 md:p-3 border-b border-emerald-700/50">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-md">
                <Map className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h1 className="text-base md:text-lg font-bold text-center mt-1 md:mt-2 tracking-wide">Admin Panel</h1>
            </div>

            {/* Bandeiras de idiomas - mais compacto */}
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => changeLanguage('pt')}
                className={`w-7 h-5 rounded-sm overflow-hidden transition-all duration-200 ${
                  i18n.language === 'pt' ? 'ring-1 ring-emerald-400 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src="https://flagcdn.com/br.svg"
                  alt="Português"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={() => changeLanguage('fr')}
                className={`w-7 h-5 rounded-sm overflow-hidden transition-all duration-200 ${
                  i18n.language === 'fr' ? 'ring-1 ring-emerald-400 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src="https://flagcdn.com/fr.svg"
                  alt="Français"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`w-7 h-5 rounded-sm overflow-hidden transition-all duration-200 ${
                  i18n.language === 'en' ? 'ring-1 ring-emerald-400 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src="https://flagcdn.com/us.svg"
                  alt="English"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Menu de navegação - espaçamento reduzido */}
        <nav className="px-2 py-1 overflow-y-auto flex-grow">
          <ul className="space-y-0.5 md:space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center px-2 py-1.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md' 
                        : 'text-white/80 hover:bg-emerald-700/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 mr-2 transition-all duration-200" />
                  <span className="text-xs md:text-sm font-medium truncate">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer com botão de logout - mais compacto */}
        <div className="p-2 border-t border-emerald-700/50 bg-emerald-900/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-1.5 rounded-lg text-white/80 hover:bg-emerald-700/50 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-xs md:text-sm font-medium">{t('admin.menu.logout')}</span>
          </button>
          
          <div className="pt-1 border-t border-emerald-700/30 mt-1">
            <div className="flex items-center justify-center">
              <Globe className="w-3 h-3 text-emerald-400/60 mr-1" />
              <span className="text-xs text-emerald-300/60">PIT-T Admin</span>
            </div>
            <p className="text-xs text-emerald-200/60 text-center text-[10px]">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </aside>

      {/* Botão para toggle da sidebar em mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full lg:hidden hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-md"
        aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay para mobile quando o sidebar está aberto */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Conteúdo principal */}
      <main className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64 ml-0' : 'ml-0'}`}>
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;