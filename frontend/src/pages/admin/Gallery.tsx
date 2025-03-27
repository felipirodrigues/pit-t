import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';

interface Location {
  id: number;
  name: string;
}

interface Gallery {
  id: number;
  name: string;
  location_id: number;
  type: 'photo' | 'video';
  location_name?: string;
}

const ITEMS_PER_PAGE = 15;

const Gallery = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location_id: '',
    type: 'photo'
  });
  const [filters, setFilters] = useState({
    name: '',
    location_id: '',
    type: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Buscar galerias
  const fetchGalleries = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/gallery');
      setGalleries(response.data);
    } catch (error) {
      console.error('Erro ao buscar galerias:', error);
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
    fetchGalleries();
    fetchLocations();
  }, []);

  // Abrir modal para edição
  const handleEdit = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setFormData({
      name: gallery.name,
      location_id: gallery.location_id.toString(),
      type: gallery.type
    });
    setShowModal(true);
  };

  // Abrir modal para nova galeria
  const handleAdd = () => {
    setSelectedGallery(null);
    setFormData({
      name: '',
      location_id: '',
      type: 'photo'
    });
    setShowModal(true);
  };

  // Excluir galeria
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta galeria?')) {
      try {
        await axios.delete(`http://localhost:3000/api/gallery/${id}`);
        fetchGalleries();
      } catch (error) {
        console.error('Erro ao excluir galeria:', error);
      }
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

  // Salvar galeria (criar ou atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        location_id: parseInt(formData.location_id)
      };

      if (selectedGallery) {
        await axios.put(`http://localhost:3000/api/gallery/${selectedGallery.id}`, data);
      } else {
        await axios.post('http://localhost:3000/api/gallery', data);
      }

      setShowModal(false);
      fetchGalleries();
    } catch (error) {
      console.error('Erro ao salvar galeria:', error);
    }
  };

  // Filtrar galerias
  const filteredGalleries = galleries.filter(gallery => {
    const matchesName = gallery.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesLocation = !filters.location_id || gallery.location_id.toString() === filters.location_id;
    const matchesType = !filters.type || gallery.type === filters.type;
    return matchesName && matchesLocation && matchesType;
  });

  // Calcular paginação
  const totalPages = Math.ceil(filteredGalleries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedGalleries = filteredGalleries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  // Navegar para os itens da galeria
  const handleViewItems = (galleryId: number) => {
    navigate(`/admin/gallery/${galleryId}/items`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{t('admin.menu.gallery')}</h1>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-green-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Adicionar Galeria
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* Filtros */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
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
          <select
            name="location_id"
            value={filters.location_id}
            onChange={handleFilterChange}
            className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="">Todas as localidades</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="">Todos os tipos</option>
            <option value="photo">Fotos</option>
            <option value="video">Vídeos</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localidade</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedGalleries.map((gallery) => (
                <tr key={gallery.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{gallery.name}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{gallery.location_name}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      gallery.type === 'photo' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {gallery.type === 'photo' ? 'Foto' : 'Vídeo'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewItems(gallery.id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                      title="Ver itens"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(gallery)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(gallery.id)}
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
        {filteredGalleries.length > 0 && (
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 bg-white px-3 py-2 sm:px-4">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-xs text-gray-700">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredGalleries.length)}
                  </span>{' '}
                  de <span className="font-medium">{filteredGalleries.length}</span> resultados
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

      {/* Modal para adicionar/editar galeria */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedGallery ? 'Editar Galeria' : 'Nova Galeria'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="photo">Foto</option>
                  <option value="video">Vídeo</option>
                </select>
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

export default Gallery;