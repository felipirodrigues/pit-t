import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface GalleryItem {
  id: number;
  gallery_id: number;
  title?: string;
  description?: string;
  url: string;
  type: 'photo' | 'video';
  created_at: string;
}

interface Gallery {
  id: number;
  name: string;
  location_id: number;
  type: 'photo' | 'video';
  location_name?: string;
}

const ITEMS_PER_PAGE = 15;

const GalleryItems = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media: null as File | null
  });
  const [filters, setFilters] = useState({
    title: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar galeria
  const fetchGallery = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/gallery/${id}`);
      setGallery(response.data);
    } catch (error) {
      console.error('Erro ao buscar galeria:', error);
      setError('Erro ao carregar dados da galeria');
    }
  };

  // Buscar itens da galeria
  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('Buscando itens da galeria:', id);
      const response = await axios.get(`http://localhost:3000/api/gallery/${id}/items`);
      console.log('Resposta da API:', response.data);
      setItems(response.data || []);
      console.log('Items atualizados:', response.data || []);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      setError('Erro ao carregar itens da galeria');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGallery();
      fetchItems();
    }
  }, [id]);

  // Abrir modal para edição
  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      media: null
    });
    setShowModal(true);
  };

  // Abrir modal para novo item
  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      description: '',
      media: null
    });
    setShowModal(true);
  };

  // Excluir item
  const handleDelete = async (itemId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await axios.delete(`http://localhost:3000/api/gallery/${id}/items/${itemId}`);
        fetchItems();
      } catch (error) {
        console.error('Erro ao excluir item:', error);
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

  // Salvar item (criar ou atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Iniciando salvamento do item...');
      
      // Validar se há arquivo selecionado
      if (!formData.media && !selectedItem) {
        alert('Por favor, selecione um arquivo.');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', gallery?.type || 'photo');
      
      if (formData.media) {
        console.log('Arquivo selecionado:', formData.media);
        formDataToSend.append('image', formData.media);
      }

      // Log do FormData para debug
      console.log('Dados sendo enviados:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      let response;
      if (selectedItem) {
        console.log('Atualizando item existente:', selectedItem.id);
        response = await axios.put(`http://localhost:3000/api/gallery/${id}/items/${selectedItem.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        });
      } else {
        console.log('Criando novo item');
        response = await axios.post(`http://localhost:3000/api/gallery/${id}/items`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        });
      }

      console.log('Resposta do servidor:', response.data);
      setShowModal(false);
      fetchItems();
    } catch (error: any) {
      console.error('Erro detalhado ao salvar item:', error);
      
      let errorMessage = 'Erro ao salvar o item. Por favor, tente novamente.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Erro de conexão com o servidor. Verifique se o servidor está rodando.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Log detalhado do erro
      console.log('Detalhes do erro:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      alert(errorMessage);
    }
  };

  // Lidar com upload de mídia
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('Arquivo selecionado:', file);
      const fileType = file.type;
      console.log('Tipo do arquivo:', fileType);
      
      // Validar tamanho do arquivo (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB em bytes
      if (file.size > maxSize) {
        alert('O arquivo é muito grande. O tamanho máximo permitido é 10MB.');
        return;
      }
      
      if (gallery?.type === 'photo' && !fileType.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      
      if (gallery?.type === 'video' && !fileType.startsWith('video/')) {
        alert('Por favor, selecione um arquivo de vídeo válido.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        media: file
      }));
    }
  };

  // Filtrar itens
  const filteredItems = items.filter(item => 
    (item?.title || '').toLowerCase().includes(filters?.title?.toLowerCase() || '')
  );
  console.log('Items filtrados:', filteredItems);

  // Calcular paginação
  const totalPages = Math.ceil((filteredItems?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];
  console.log('Items paginados:', paginatedItems);

  // Atualizar filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value || ''
    }));
    setCurrentPage(1);
  };

  // Navegação da paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({
      title: '',
      description: '',
      media: null
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando itens da galeria...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchItems();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Galeria não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/gallery')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{gallery.name}</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-green-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Adicionar Item
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* Filtros */}
        <div className="mb-4">
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

        {/* Lista de Itens */}
        {!items || items.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum item cadastrado</h3>
            <p className="text-sm text-gray-500">
              Esta galeria ainda não possui itens. Clique no botão "Adicionar Item" para começar.
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedItems.map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden">
                    {item.type === 'photo' ? (
                      <img
                        src={`http://localhost:3000${item.url}`}
                        alt={item.title || 'Imagem sem título'}
                        className="w-full h-48 object-cover"
                        onError={(e) => console.error('Erro ao carregar imagem:', e)}
                      />
                    ) : (
                      <video
                        src={`http://localhost:3000${item.url}`}
                        className="w-full h-48 object-cover"
                        controls
                        onError={(e) => console.error('Erro ao carregar vídeo:', e)}
                      />
                    )}
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900">{item.title || 'Sem título'}</h3>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      )}
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
                    <div className="w-32 h-32 flex-shrink-0">
                      {item.type === 'photo' ? (
                        <img
                          src={`http://localhost:3000${item.url}`}
                          alt={item.title || 'Imagem sem título'}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => console.error('Erro ao carregar imagem:', e)}
                        />
                      ) : (
                        <video
                          src={`http://localhost:3000${item.url}`}
                          className="w-full h-full object-cover rounded-md"
                          controls
                          onError={(e) => console.error('Erro ao carregar vídeo:', e)}
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-900">{item.title || 'Sem título'}</h3>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginação */}
            {filteredItems.length > 0 && (
              <div className="mt-3 flex items-center justify-between border-t border-gray-200 bg-white px-3 py-2 sm:px-4">
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-700">
                      Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                      <span className="font-medium">
                        {Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)}
                      </span>{' '}
                      de <span className="font-medium">{filteredItems.length}</span> resultados
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
          </>
        )}
      </div>

      {/* Modal para adicionar/editar item */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">
                {selectedItem ? 'Editar Item' : 'Novo Item'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {gallery.type === 'photo' ? 'Foto' : 'Vídeo'}
                </label>
                <input
                  type="file"
                  name="media"
                  onChange={handleMediaChange}
                  accept={gallery.type === 'photo' ? 'image/*' : 'video/*'}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {selectedItem && (
                  <div className="mt-2">
                    {gallery.type === 'photo' ? (
                      <img
                        src={`http://localhost:3000${selectedItem.url}`}
                        alt={selectedItem.title || 'Imagem sem título'}
                        className="w-20 h-20 object-cover"
                      />
                    ) : (
                      <video
                        src={`http://localhost:3000${selectedItem.url}`}
                        className="w-20 h-20 object-cover"
                        controls
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  {selectedItem ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryItems;