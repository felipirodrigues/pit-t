import React from 'react';
import { useTranslation } from 'react-i18next';
import AmapaMap from '../components/map/AmapaMap';
import RightSidebar from '../components/layout/RightSidebar';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1">
      {/* Conteúdo Principal (Mapa) */}
      <main className="pr-80 h-screen">
        <div className="h-full p-6">
          <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-4 text-white">Mapa Interativo</h1>
            <p className="text-white/80 mb-6">
              Navegue por nosso mapa interativo e clique nas localidades marcada para conhecer mais sobre ela
            </p>
            
            {/* Área do Mapa */}
            <div className="flex-1 max-h-[calc(100vh-200px)] bg-white/5 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-white/10">
              <AmapaMap />
            </div>
          </div>
        </div>
      </main>

      {/* Barra Lateral Direita */}
      <RightSidebar />
    </div>
  );
};

export default Home;