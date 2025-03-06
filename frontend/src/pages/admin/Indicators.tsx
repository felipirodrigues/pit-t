import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Location {
  id: number;
  name: string;
}

interface Indicator {
  id: number;
  location_id: number;
  location_name: string;
  title: string;
  value: number;
  unit?: string;
}

const Indicators = () => {
  const { t } = useTranslation();
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [formData, setFormData] = useState({
    location_id: '',
    title: '',
    value: '',
    unit: ''
  });

  // Buscar indicadores
  const fetchIndicators = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/indicators');
      setIndicators(response.data);
    } catch (error) {
      console.error('Erro ao buscar indicadores:', error);
    }
  };

  // Buscar localidades
  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Erro ao buscar localidades:', error);
    }
  };

  useEffect(() => {
    fetchIndicators();
    fetchLocations();
  }, []);

  // Abrir modal para edição
  const handleEdit = (indicator: Indicator) => {
    setSelectedIndicator(indicator);
    setFormData({
      location_id: indicator.location_id.toString(),
      title: indicator.title,
      value: indicator.value.toString(),
      unit: indicator.unit || ''
    });
    setShowModal(true);
  };

  // Abrir modal para novo indicador
  const handleAdd = () => {
    setSelectedIndicator(null);
    setFormData({
      location_id: '',
      title: '',
      value: '',
      unit: ''
    });
    setShowModal(true);
  };

  // Excluir indicador
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este indicador?')) {
      try {
        await axios.delete(`http://localhost:3000/api/indicators/${id}`);
        fetchIndicators();
      } catch (error) {
        console.error('Erro ao excluir indicador:', error);
      }
    }
  };

  // Salvar indicador (criar ou atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        location_id: parseInt(formData.location_id),
        value: parseFloat(formData.value)
      };

      if (selectedIndicator) {
        // Atualizar indicador existente
        await axios.put(`http://localhost:3000/api/indicators/${selectedIndicator.id}`, data);
      } else {
        // Criar novo indicador
        await axios.post('http://localhost:3000/api/indicators', data);
      }

      setShowModal(false);
      fetchIndicators();
    } catch (error) {
      console.error('Erro ao salvar indicador:', error);
    }
  };

  // Atualizar dados do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('admin.menu.indicators')}</h1>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Indicador
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {indicators.map((indicator) => (
                <tr key={indicator.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{indicator.location_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{indicator.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{indicator.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{indicator.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(indicator)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(indicator.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para adicionar/editar indicador */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedIndicator ? 'Editar Indicador' : 'Novo Indicador'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Localidade</label>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione uma localidade</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor</label>
                <input
                  type="number"
                  step="any"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unidade de Medida</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ex: km², R$, habitantes"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Indicators;