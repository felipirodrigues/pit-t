import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, ExternalLink, File, Eye, Calendar, User, Tag } from 'lucide-react';
import api, { API_BASE_URL } from '../../services/api';

interface TwinCity {
  id: number;
  cityA_name: string;
  cityB_name: string;
  name: string;
}

interface Document {
  id: number;
  title: string;
  author: string;
  publication_year: number;
  category: string;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  kind: 'internal' | 'external';
  external_url: string | null;
  twin_city_id: number | null;
  twin_city_name: string | null;
  tags: string[];
}

interface Filters {
  search: string;
  category: string;
  twin_city_id: string;
  page: number;
}

const Collection = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [twinCities, setTwinCities] = useState<TwinCity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    twin_city_id: '',
    page: 1
  });
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publication_year: '',
    category: 'books',
    kind: 'internal' as 'internal' | 'external',
    twin_city_id: '',
    external_url: '',
    file: null as File | null
  });

  const ITEMS_PER_PAGE = 10;

  // Buscar cidades gêmeas
  const fetchTwinCities = async () => {
    try {
      setError(null);
      const response = await api.get('/twin-cities');
      const twinCitiesData = response.data.map((tc: any) => ({
        ...tc,
        name: `${tc.cityA_name} - ${tc.cityB_name}`
      }));
      setTwinCities(twinCitiesData || []);
    } catch (error) {
      console.error('Erro ao buscar cidades gêmeas:', error);
      setError('Erro ao carregar cidades gêmeas');
      setTwinCities([]);
    }
  };

  // Buscar documentos
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: ITEMS_PER_PAGE.toString()
      });

      console.log('Buscando documentos com params:', Object.fromEntries(params));
      const response = await api.get(`/digital-collection?${params}`);
      console.log('Resposta da API:', response.data);

      if (!response.data) {
        throw new Error('Resposta da API está vazia');
      }

      const { documents = [], total = 0 } = response.data;
      console.log('Documentos encontrados:', documents.length);
      
      setDocuments(documents);
      setTotalDocuments(total);
    } catch (error: any) {
      console.error('Erro ao buscar documentos:', error);
      setError(error.response?.data?.error || 'Erro ao carregar documentos');
      setDocuments([]);
      setTotalDocuments(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTwinCities();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  // Manipular filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Resetar página ao filtrar
    }));
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      twin_city_id: '',
      page: 1
    });
  };

  // Paginação
  const totalPages = Math.ceil(totalDocuments / ITEMS_PER_PAGE);
  
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Abrir modal para edição
  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setFormData({
      title: document.title,
      author: document.author,
      publication_year: document.publication_year.toString(),
      category: document.category,
      kind: document.kind,
      twin_city_id: document.twin_city_id?.toString() || '',
      external_url: document.external_url || '',
      file: null
    });
    setShowModal(true);
  };

  // Abrir modal para novo documento
  const handleAdd = () => {
    setSelectedDocument(null);
    setFormData({
      title: '',
      author: '',
      publication_year: '',
      category: 'books',
      kind: 'internal',
      twin_city_id: '',
      external_url: '',
      file: null
    });
    setShowModal(true);
  };

  // Excluir documento
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      try {
        await api.delete(`/digital-collection/${id}`);
        fetchDocuments();
      } catch (error) {
        console.error('Erro ao excluir documento:', error);
      }
    }
  };

  // Abrir documento para visualização
  const handleViewDocument = (document: Document) => {
    if (document.kind === 'external' && document.external_url) {
      window.open(document.external_url, '_blank');
    } else if (document.kind === 'internal' && document.file_url) {
      window.open(`${API_BASE_URL}${document.file_url}`, '_blank');
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

  // Lidar com upload de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };

  // Salvar documento (criar ou atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Preparar dados básicos comuns a todos os tipos de documento
      const baseData = {
        title: formData.title,
        author: formData.author,
        publication_year: formData.publication_year,
        category: formData.category,
        kind: formData.kind,
        twin_city_id: formData.twin_city_id
      };
      
      // Verificar se a cidade gêmea foi selecionada
      if (!formData.twin_city_id) {
        setError('É necessário selecionar uma cidade gêmea');
        return;
      }

      let url = '';
      let method = api.post;
      let data: any = null;
      let headers = {};

      // Escolher a URL apropriada e determinar como enviar os dados
      if (selectedDocument) {
        // Para atualização
        if (formData.kind === 'external') {
          url = `/digital-collection/external/${selectedDocument.id}`;
          data = {
            ...baseData,
            external_url: formData.external_url
          };
          headers = { 'Content-Type': 'application/json' };
          method = api.put;
        } else {
          url = `/digital-collection/${selectedDocument.id}`;
          const formDataToSend = new FormData();
          for (const key in baseData) {
            formDataToSend.append(key, baseData[key as keyof typeof baseData]);
          }
          if (formData.file) {
            formDataToSend.append('file', formData.file);
          }
          data = formDataToSend;
          headers = { 'Content-Type': 'multipart/form-data' };
          method = api.put;
        }
      } else {
        // Para criação
        if (formData.kind === 'external') {
          url = '/digital-collection/external';
          data = {
            ...baseData,
            external_url: formData.external_url
          };
          headers = { 'Content-Type': 'application/json' };
        } else {
          url = '/digital-collection';
          const formDataToSend = new FormData();
          for (const key in baseData) {
            formDataToSend.append(key, baseData[key as keyof typeof baseData]);
          }
          if (formData.file) {
            formDataToSend.append('file', formData.file);
          }
          data = formDataToSend;
          headers = { 'Content-Type': 'multipart/form-data' };
        }
      }

      console.log('Enviando para URL:', url);
      console.log('Tipo de documento:', formData.kind);
      console.log('Dados enviados:', data instanceof FormData ? 'FormData (com arquivo)' : data);
      console.log('Headers:', headers);

      await method(url, data, { headers });

      setShowModal(false);
      setError(null);
      // Resetar os filtros ao criar/editar um documento
      setFilters({
        search: '',
        category: '',
        twin_city_id: '',
        page: 1
      });
      await fetchDocuments(); // Recarregar a lista
    } catch (error: any) {
      console.error('Erro ao salvar documento:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao salvar documento';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  // Obter cor com base na categoria
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'books': 'blue',
      'articles': 'green',
      'reports': 'orange',
      'others': 'purple'
    };
    
    return categoryColors[category.toLowerCase()] || 'gray';
  };

  // Traduzir categorias
  const translateCategory = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'books': return 'Livros';
      case 'articles': return 'Artigos';
      case 'reports': return 'Relatórios';
      case 'others': return 'Outros';
      default: return category;
    }
  };

  // Renderizar lista de cards para mobile
  const renderMobileCards = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-2">Carregando...</span>
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="bg-white rounded-lg py-8 px-4 text-center text-gray-500">
          Nenhum documento encontrado
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {documents.map((document) => {
          const categoryColor = getCategoryColor(document.category);
          const colorClasses = {
            blue: 'border-l-blue-500 bg-blue-50',
            green: 'border-l-green-500 bg-green-50',
            orange: 'border-l-orange-500 bg-orange-50',
            purple: 'border-l-purple-500 bg-purple-50',
            gray: 'border-l-gray-500 bg-gray-50'
          };
          
          return (
            <div 
              key={document.id} 
              className={`bg-white rounded-lg shadow border border-gray-100 overflow-hidden border-l-4 ${colorClasses[categoryColor as keyof typeof colorClasses]}`}
            >
              <div className="p-3">
                <div className="flex flex-col space-y-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium bg-${categoryColor}-100 text-${categoryColor}-800 mb-1.5`}>
                          {translateCategory(document.category)}
                        </span>
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {document.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <span>{document.author}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <span>{document.publication_year}</span>
                      </div>
                      
                      {document.twin_city_name && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Tag className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span>{document.twin_city_name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-gray-500">
                        {document.kind === 'internal' ? (
                          <span className="flex items-center gap-1">
                            <File className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            Arquivo interno
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-blue-600">
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            Link externo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleViewDocument(document)}
                      className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
                      title="Visualizar"
                      disabled={!document.file_url && !document.external_url}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(document)}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h1 className="text-2xl font-bold">{t('admin.menu.collection')}</h1>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-5 h-5" />
          Adicionar Documento
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold mb-3 sm:mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Título, autor ou tags..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Todas</option>
              <option value="books">Livros</option>
              <option value="reports">Relatórios</option>
              <option value="articles">Artigos</option>
              <option value="others">Outros</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade Gêmea</label>
            <select
              name="twin_city_id"
              value={filters.twin_city_id}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Todas</option>
              {twinCities.map(twinCity => (
                <option key={twinCity.id} value={twinCity.id}>{twinCity.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Versão mobile: cards */}
      <div className="sm:hidden">
        {renderMobileCards()}
      </div>

      {/* Versão desktop: tabela */}
      <div className="hidden sm:block bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade Gêmea</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      <span className="ml-2">Carregando...</span>
                    </div>
                  </td>
                </tr>
              ) : documents && documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhum documento encontrado
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr key={document.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{document.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.publication_year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.kind === 'internal' ? (
                        <span className="flex items-center gap-1">
                          <File size={16} />
                          {t('document.type.internal', 'Interno')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-600">
                          <ExternalLink size={16} />
                          {t('document.type.external', 'Externo')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.twin_city_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDocument(document)}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Visualizar"
                        disabled={!document.file_url && !document.external_url}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(document)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação responsiva */}
      {!loading && !error && totalDocuments > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between bg-white rounded-lg p-3 sm:px-4 shadow-md">
          <div className="text-xs text-center sm:text-left text-gray-700">
            Mostrando <span className="font-medium">{((filters.page - 1) * ITEMS_PER_PAGE) + 1}</span> a{' '}
            <span className="font-medium">
              {Math.min(filters.page * ITEMS_PER_PAGE, totalDocuments)}
            </span>{' '}
            de <span className="font-medium">{totalDocuments}</span> resultados
          </div>
          
          <div className="flex justify-center w-full sm:w-auto">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="relative inline-flex items-center rounded-l-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Anterior</span>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              
              {/* Em telas pequenas, mostrar apenas a página atual */}
              <div className="sm:hidden relative inline-flex items-center px-3 py-2 text-sm font-semibold bg-green-600 text-white focus:z-20">
                {filters.page} de {totalPages}
              </div>
              
              {/* Em telas maiores, mostrar as páginas */}
              <div className="hidden sm:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-3 py-1.5 text-xs font-semibold ${
                      page === filters.page
                        ? 'z-10 bg-green-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="relative inline-flex items-center rounded-r-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Próximo</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Modal para adicionar/editar documento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {selectedDocument ? 'Editar Documento' : 'Novo Documento'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 text-xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700">Autor</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ano de Publicação</label>
                <input
                  type="number"
                  name="publication_year"
                  value={formData.publication_year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="books">Livros</option>
                  <option value="reports">Relatórios</option>
                  <option value="articles">Artigos</option>
                  <option value="others">Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                <select
                  name="kind"
                  value={formData.kind}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="internal">Documento Interno (Upload)</option>
                  <option value="external">Link Externo</option>
                </select>
              </div>

              {formData.kind === 'external' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL Externa</label>
                  <input
                    type="url"
                    name="external_url"
                    value={formData.external_url}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="https://exemplo.com/documento.pdf"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Arquivo</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100"
                    required={!selectedDocument || selectedDocument.kind !== 'internal'}
                  />
                  {selectedDocument && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedDocument.file_url ? 
                        "Deixe em branco para manter o arquivo atual" : 
                        "Arquivo obrigatório"
                      }
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade Gêmea <span className="text-red-500">*</span></label>
                <select
                  name="twin_city_id"
                  value={formData.twin_city_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione uma cidade gêmea</option>
                  {twinCities.map(twinCity => (
                    <option key={twinCity.id} value={twinCity.id}>{twinCity.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
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

export default Collection;