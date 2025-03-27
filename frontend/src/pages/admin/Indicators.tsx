import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';

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

const ITEMS_PER_PAGE = 15;

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
  const [filters, setFilters] = useState({
    location: '',
    title: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filtrar indicadores
  const filteredIndicators = indicators.filter(indicator => {
    const matchesLocation = indicator.location_name.toLowerCase().includes(filters.location.toLowerCase());
    const matchesTitle = indicator.title.toLowerCase().includes(filters.title.toLowerCase());
    return matchesLocation && matchesTitle;
  });

  // Calcular paginação
  const totalPages = Math.ceil(filteredIndicators.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIndicators = filteredIndicators.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Atualizar filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Resetar para primeira página quando filtrar
  };

  // Navegação da paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{t('admin.menu.indicators')}</h1>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-green-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Adicionar Indicador
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* Filtros */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Buscar por localidade..."
              className="pl-8 pr-3 py-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="Buscar por título..."
              className="pl-8 pr-3 py-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localidade</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedIndicators.map((indicator) => (
                <tr key={indicator.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{indicator.location_name}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{indicator.title}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{indicator.value}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{indicator.unit}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(indicator)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(indicator.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {filteredIndicators.length > 0 && (
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 bg-white px-3 py-2 sm:px-4">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-xs text-gray-700">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredIndicators.length)}
                  </span>{' '}
                  de <span className="font-medium">{filteredIndicators.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-1.5 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-3 py-1.5 text-xs font-semibold ${
                        currentPage === page
                          ? 'z-10 bg-green-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-1.5 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Próximo</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
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