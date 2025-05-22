import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => toggleLanguage('pt-BR')}
        className={`w-8 h-6 rounded-sm overflow-hidden transition-opacity ${
          i18n.language === 'pt-BR' ? 'opacity-100' : 'opacity-50 hover:opacity-75'
        }`}
        aria-label="Português"
      >
        <img
          src="https://flagcdn.com/br.svg"
          alt="Bandeira do Brasil"
          className="w-full h-full object-cover"
        />
      </button>
      <button
        onClick={() => toggleLanguage('fr-FR')}
        className={`w-8 h-6 rounded-sm overflow-hidden transition-opacity ${
          i18n.language === 'fr-FR' ? 'opacity-100' : 'opacity-50 hover:opacity-75'
        }`}
        aria-label="Français"
      >
        <img
          src="https://flagcdn.com/fr.svg"
          alt="Drapeau de la France"
          className="w-full h-full object-cover"
        />
      </button>
      <button
        onClick={() => toggleLanguage('en-US')}
        className={`w-8 h-6 rounded-sm overflow-hidden transition-opacity ${
          i18n.language === 'en-US' ? 'opacity-100' : 'opacity-50 hover:opacity-75'
        }`}
        aria-label="English"
      >
        <img
          src="https://flagcdn.com/us.svg"
          alt="United States Flag"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
};

export default LanguageSwitcher;