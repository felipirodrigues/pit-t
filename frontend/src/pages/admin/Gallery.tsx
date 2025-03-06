import React from 'react';
import { useTranslation } from 'react-i18next';

const Gallery = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.menu.gallery')}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Gerenciamento da Galeria - Em desenvolvimento</p>
      </div>
    </div>
  );
};

export default Gallery;