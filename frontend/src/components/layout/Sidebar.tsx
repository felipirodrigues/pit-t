import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookCopy, Users, Camera, Map, X, Menu, LogIn } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const closeSidebar = () => setIsOpen(false);

  const menuItems = [
    { to: "/", icon: Home, text: t('menu.home') },
    { to: "/acervo", icon: BookCopy, text: t('menu.digitalCollection') },
    { to: "/colabore", icon: Users, text: t('menu.collaborate') },
    { to: "/galeria", icon: Camera, text: t('menu.gallery') },
  ];

  return (
    <>
      {/* Botão do Menu Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-2 left-2 z-50 p-1.5 bg-forest-green text-white rounded-lg md:hidden hover:bg-forest-green/90 transition-colors"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay para Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-56 bg-forest-green text-white transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        <div className="p-2 border-b border-forest-green/20">
          <div className="flex items-center justify-between md:block">
            <Map className="w-8 h-8 mx-auto text-green-400" />
            <button
              onClick={closeSidebar}
              className="md:hidden text-white/70 hover:text-white transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h1 className="text-base font-bold text-center mt-1">PIT-T</h1>
          <p className="text-xs text-center mt-0.5 text-white/80">
            Plataforma Interativa de Tipologias Transfronteiriças
          </p>
          <div className="mt-2 flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>

        <nav className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-green-600 text-white' 
                        : 'text-white/80 hover:bg-forest-green/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-forest-green/20">
          <Link
            to="/auth"
            onClick={closeSidebar}
            className="flex p-2 mb-2 rounded-lg text-white/80 hover:bg-forest-green/50 hover:text-white transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" />
            <span className="text-sm">{t('menu.login')}</span>
          </Link>
          <p className="text-xs text-white/60 text-center">
            {t('footer.copyright')}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;