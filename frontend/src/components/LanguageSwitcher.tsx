import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  
  const languages: LanguageOption[] = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-1 sm:space-x-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center px-2 py-1 rounded-md text-sm transition-colors ${
              i18n.language === lang.code
                ? 'bg-green-100 text-green-800 font-medium'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="mr-1.5 text-base">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher; 