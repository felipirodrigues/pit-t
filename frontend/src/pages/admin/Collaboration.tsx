import React from 'react';
import { useTranslation } from 'react-i18next';

const Collaboration = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.menu.collaboration')}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Gerenciamento de Colaborações - Em desenvolvimento</p>
      </div>
    </div>
  );
};

export default Collaboration;