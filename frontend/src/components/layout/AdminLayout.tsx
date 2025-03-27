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
  LogOut
} from 'lucide-react';

const AdminLayout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: t('admin.menu.dashboard') },
    { path: '/admin/locations', icon: MapPin, label: t('admin.menu.locations') },
    { path: '/admin/indicators', icon: TrendingUp, label: t('admin.menu.indicators') },
    { path: '/admin/gallery', icon: Image, label: t('admin.menu.gallery') },
    { path: '/admin/collection', icon: BookOpen, label: t('admin.menu.collection') },
    { path: '/admin/user', icon: Users, label: t('admin.menu.users') },
    { path: '/admin/collaboration', icon: MessageSquare, label: t('admin.menu.collaboration') },
    { path: '/admin/reports', icon: FileBarChart, label: t('admin.menu.reports') }
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-forest-green">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
          <Map className="w-12 h-12 mx-auto text-green-400" />
          </div>

          {/* Bandeiras de idiomas */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => changeLanguage('pt')}
              className={`w-8 h-6 rounded-sm overflow-hidden ${
                i18n.language === 'pt' ? 'ring-2 ring-white' : ''
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
              className={`w-8 h-6 rounded-sm overflow-hidden ${
                i18n.language === 'fr' ? 'ring-2 ring-white' : ''
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
              className={`w-8 h-6 rounded-sm overflow-hidden ${
                i18n.language === 'en' ? 'ring-2 ring-white' : ''
              }`}
            >
              <img
                src="https://flagcdn.com/us.svg"
                alt="English"
                className="w-full h-full object-cover"
              />
            </button>
          </div>

          {/* Menu */}
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-600 text-white'
                        : 'text-white/80 hover:bg-forest-green/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Botão de logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-forest-green/20">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 rounded-lg text-white/80 hover:bg-forest-green/50 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-sm">{t('admin.menu.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`fixed top-4 left-4 z-40 p-2 bg-forest-green text-white rounded-lg md:hidden hover:bg-forest-green/90 transition-colors ${
          isSidebarOpen ? 'hidden' : 'block'
        }`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main content */}
      <div className={`p-4 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        <div className="p-4 rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;