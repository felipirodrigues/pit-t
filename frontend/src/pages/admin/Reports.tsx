import React from 'react';
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.menu.reports')}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Relatórios - Em desenvolvimento</p>
      </div>
    </div>
  );
};

export default Reports;