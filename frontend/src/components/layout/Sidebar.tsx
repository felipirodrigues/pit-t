import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookCopy, Users, Camera, Map, X, Menu, LogIn, Globe } from 'lucide-react';
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
        className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full md:hidden hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-md"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay para Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-56 lg:w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white transform transition-all duration-300 ease-in-out z-50 shadow-xl flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        {/* Logo e header */}
        <div className="relative overflow-hidden flex-shrink-0">
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
            <div className="mt-2 md:mt-3 flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Links de navegação */}
        <nav className="p-2 md:p-3 mt-1 md:mt-2 overflow-y-auto flex-grow">
          <ul className="space-y-1 md:space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
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

        {/* Footer */}
        <div className="p-2 md:p-3 border-t border-emerald-700/50 bg-emerald-900/50 flex-shrink-0">
          <Link
            to="/auth"
            onClick={closeSidebar}
            className="flex items-center p-2 md:p-3 mb-2 rounded-lg text-white/80 hover:bg-emerald-700/50 hover:text-white transition-all duration-200"
          >
            <LogIn className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
            <span className="text-sm font-medium">{t('menu.login')}</span>
          </Link>
          <div className="pt-2 border-t border-emerald-700/30">
            <div className="flex items-center justify-center mb-1">
              <Globe className="w-4 h-4 text-emerald-400/60 mr-1" />
              <span className="text-xs text-emerald-300/60">PIT-T</span>
            </div>
            <p className="text-xs text-emerald-200/60 text-center">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;