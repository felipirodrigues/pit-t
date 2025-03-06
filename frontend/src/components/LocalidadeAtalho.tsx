import React from 'react';

interface Localidade {
  id: number;
  nome: string;
  bandeiraUrl: string;
}

const LocalidadeAtalho = ({ localidades }: { localidades: Localidade[] }) => {
  return (
    <div className="flex space-x-4 mb-6">
      {localidades.map((localidade) => (
        <div key={localidade.id} className="text-center">
          <img
            src={localidade.bandeiraUrl}
            alt={localidade.nome}
            className="w-12 h-12 rounded-full mx-auto"
          />
          <p className="text-sm mt-2">{localidade.nome}</p>
        </div>
      ))}
    </div>
  );
};

export default LocalidadeAtalho; 