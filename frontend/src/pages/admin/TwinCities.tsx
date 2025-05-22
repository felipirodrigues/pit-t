import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface TwinCity {
  id: number;
  cityA_name: string;
  cityA_latitude: number;
  cityA_longitude: number;
  cityB_name: string;
  cityB_latitude: number;
  cityB_longitude: number;
  description?: string;
}

const ITEMS_PER_PAGE = 15;

const TwinCities = () => {
  const { t } = useTranslation();
  const [twinCities, setTwinCities] = useState<TwinCity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTwinCity, setSelectedTwinCity] = useState<TwinCity | null>(null);
  const [formData, setFormData] = useState({
    cityA_name: '',
    cityA_latitude: '',
    cityA_longitude: '',
    cityB_name: '',
    cityB_latitude: '',
    cityB_longitude: '',
    description: ''
  });
  const [filters, setFilters] = useState({
    name: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Buscar cidades gêmeas
  const fetchTwinCities = async () => {
    try {
      const response = await api.get('/twin-cities');
      setTwinCities(response.data);
    } catch (error) {
      console.error('Erro ao buscar cidades gêmeas:', error);
    }
  };

  useEffect(() => {
    fetchTwinCities();
  }, []);

  // Abrir modal para edição
  const handleEdit = (twinCity: TwinCity) => {
    setSelectedTwinCity(twinCity);
    setFormData({
      cityA_name: twinCity.cityA_name,
      cityA_latitude: twinCity.cityA_latitude.toString(),
      cityA_longitude: twinCity.cityA_longitude.toString(),
      cityB_name: twinCity.cityB_name,
      cityB_latitude: twinCity.cityB_latitude.toString(),
      cityB_longitude: twinCity.cityB_longitude.toString(),
      description: twinCity.description || ''
    });
    setShowModal(true);
  };

  // Abrir modal para nova cidade gêmea
  const handleAdd = () => {
    setSelectedTwinCity(null);
    setFormData({
      cityA_name: '',
      cityA_latitude: '',
      cityA_longitude: '',
      cityB_name: '',
      cityB_latitude: '',
      cityB_longitude: '',
      description: ''
    });
    setShowModal(true);
  };

  // Excluir cidade gêmea
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta dupla de cidades gêmeas?')) {
      try {
        await api.delete(`/twin-cities/${id}`);
        fetchTwinCities();
      } catch (error) {
        console.error('Erro ao excluir cidades gêmeas:', error);
      }
    }
  };

  // Atualizar dados do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Salvar cidade gêmea (criar ou atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        cityA_name: formData.cityA_name,
        cityA_latitude: parseFloat(formData.cityA_latitude),
        cityA_longitude: parseFloat(formData.cityA_longitude),
        cityB_name: formData.cityB_name,
        cityB_latitude: parseFloat(formData.cityB_latitude),
        cityB_longitude: parseFloat(formData.cityB_longitude),
        description: formData.description || null
      };

      if (selectedTwinCity) {
        await api.put(`/twin-cities/${selectedTwinCity.id}`, dataToSend);
      } else {
        await api.post('/twin-cities', dataToSend);
      }

      setShowModal(false);
      fetchTwinCities();
    } catch (error) {
      console.error('Erro ao salvar cidades gêmeas:', error);
    }
  };

  // Filtrar cidades gêmeas
  const filteredTwinCities = twinCities.filter(twinCity => {
    const combinedName = `${twinCity.cityA_name} ${twinCity.cityB_name}`.toLowerCase();
    return combinedName.includes(filters.name.toLowerCase());
  });

  // Calcular paginação
  const totalPages = Math.ceil(filteredTwinCities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTwinCities = filteredTwinCities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  // Renderizar lista de cards para mobile
  const renderMobileCards = () => {
    if (paginatedTwinCities.length === 0) {
      return (
        <div className="bg-white rounded-lg py-8 px-4 text-center text-gray-500">
          Nenhuma cidade gêmea encontrada.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {paginatedTwinCities.map((twinCity) => (
          <div 
            key={twinCity.id} 
            className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden"
          >
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <h3 className="font-medium text-gray-900">
                      {twinCity.cityA_name} - {twinCity.cityB_name}
                    </h3>
                  </div>
                  {twinCity.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {twinCity.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(twinCity)}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(twinCity.id)}
                    className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-xl font-bold">Cidades Gêmeas</h1>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-green-600 transition-colors text-sm w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4" />
          Adicionar Cidades Gêmeas
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* Filtros */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Buscar por nome..."
              className="pl-8 pr-3 py-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Versão mobile: cards */}
        <div className="sm:hidden">
          {renderMobileCards()}
        </div>

        {/* Versão desktop: tabela */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTwinCities.map((twinCity) => (
                <tr key={twinCity.id}>
                  <td className="px-4 py-2">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {twinCity.cityA_name} - {twinCity.cityB_name}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(twinCity)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(twinCity.id)}
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

        {/* Paginação responsiva */}
        {filteredTwinCities.length > 0 && (
          <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between border-t border-gray-200 bg-white px-3 py-3 sm:px-4">
            <div className="text-xs text-center sm:text-left text-gray-700">
              Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredTwinCities.length)}
              </span>{' '}
              de <span className="font-medium">{filteredTwinCities.length}</span> resultados
            </div>
            
            <div className="flex justify-center w-full sm:w-auto">
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                
                {/* Em telas pequenas, mostrar apenas a página atual */}
                <div className="sm:hidden relative inline-flex items-center px-3 py-2 text-sm font-semibold bg-green-600 text-white focus:z-20">
                  {currentPage} de {totalPages}
                </div>
                
                {/* Em telas maiores, mostrar as páginas */}
                <div className="hidden sm:flex">
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
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Próximo</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Modal para adicionar/editar cidades gêmeas */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {selectedTwinCity ? 'Editar Cidades Gêmeas' : 'Novas Cidades Gêmeas'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-3 border-l-4 border-blue-500 mb-4">
                  <h3 className="text-md font-medium text-blue-700 mb-2">Cidade A</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      name="cityA_name"
                      value={formData.cityA_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        name="cityA_latitude"
                        value={formData.cityA_latitude}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        name="cityA_longitude"
                        value={formData.cityA_longitude}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-purple-50 p-3 border-l-4 border-purple-500 mb-4">
                  <h3 className="text-md font-medium text-purple-700 mb-2">Cidade B</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      name="cityB_name"
                      value={formData.cityB_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        name="cityB_latitude"
                        value={formData.cityB_latitude}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        name="cityB_longitude"
                        value={formData.cityB_longitude}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição (opcional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
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
        </div>
      )}
    </div>
  );
};

export default TwinCities; 