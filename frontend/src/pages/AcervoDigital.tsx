import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, Share2, Filter, Tag, Book, FileText, Calendar, User, File } from 'lucide-react';
import api, { API_BASE_URL } from '../services/api';

interface Document {
  id: number;
  title: string;
  author: string;
  publication_year: number;
  category: string;
  file_url: string | null;
  external_url: string | null;
  file_type: string;
  file_size: number;
  twin_city_id: number | null;
  twin_city_name: string | null;
  tags: string[];
  kind: 'internal' | 'external';
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Opções de categoria para filtro
const CATEGORIES = [
  { value: '', label: 'Todas as categorias' },
  { value: 'books', label: 'Livros' },
  { value: 'articles', label: 'Artigos' },
  { value: 'reports', label: 'Relatórios' },
  { value: 'others', label: 'Outros' }
];

// Função para traduzir categorias
const translateCategory = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'books': return 'Livros';
    case 'articles': return 'Artigos';
    case 'reports': return 'Relatórios';
    case 'others': return 'Outros';
    default: return category;
  }
};

const AcervoDigital = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchDocuments = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/digital-collection', {
        params: {
          search: searchTerm,
          category: selectedCategory,
          page,
          limit: 10
        }
      });

      setDocuments(response.data.documents || response.data);
      
      // Ajustando para diferentes formatos de resposta da API
      if (response.data.total !== undefined) {
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(response.data.total / 10),
          totalItems: response.data.total
        });
      } else {
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(response.data.length / 10) || 1,
          totalItems: response.data.length
        });
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      setError('Erro ao carregar documentos do acervo. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments(1);
  };

  const handlePageChange = (page: number) => {
    fetchDocuments(page);
  };

  const handleDownload = (document: Document) => {
    if (document.kind === 'external' && document.external_url) {
      window.open(document.external_url, '_blank');
    } else if (document.file_url) {
      window.open(`${API_BASE_URL}${document.file_url}`, '_blank');
    }
  };

  const handleShare = (document: Document) => {
    const url = document.kind === 'external' && document.external_url 
      ? document.external_url 
      : `${API_BASE_URL}${document.file_url}`;
    
    navigator.clipboard.writeText(url);
    alert('Link copiado para a área de transferência!');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'books':
        return <Book className="h-4 w-4 mr-1" />;
      default:
        return <FileText className="h-4 w-4 mr-1" />;
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

  // Renderizar lista de cards para mobile
  const renderMobileCards = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
          
          const actionClasses = {
            download: document.kind === 'external' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700', 
            share: 'bg-green-100 text-green-700'
          };

          const actionTexts = {
            download: document.kind === 'external' ? 'Acessar' : 'Download',
            share: 'Compartilhar'
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
                      
                      {document.file_type && (
                        <div className="flex items-center text-xs text-gray-500">
                          <File className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span>{document.file_type.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDownload(document)}
                      className={`px-2.5 py-1 text-xs rounded-full flex items-center ${actionClasses.download}`}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      {actionTexts.download}
                    </button>
                    
                    <button
                      onClick={() => handleShare(document)}
                      className={`px-2.5 py-1 text-xs rounded-full flex items-center ${actionClasses.share}`}
                    >
                      <Share2 className="h-3.5 w-3.5 mr-1" />
                      {actionTexts.share}
                    </button>
                    
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 w-full">
                        {document.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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
    <div className="w-full px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Acervo Digital</h1>

      {/* Search and Filters */}
      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por título, autor ou cidade gêmea..."
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  {CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
            >
              <span className="sm:hidden">Buscar</span>
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
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
      <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade Gêmea
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Carregando...</span>
                    </div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhum documento encontrado
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div>
                        {document.title}
                        {document.tags && document.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {document.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.publication_year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.file_type ? document.file_type.toUpperCase() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {getDocumentIcon(document.category)}
                        {translateCategory(document.category)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.twin_city_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleDownload(document)}
                          className="text-blue-600 hover:text-blue-900"
                          title={document.kind === 'external' ? 'Abrir link externo' : 'Baixar'}
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleShare(document)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Compartilhar"
                        >
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação responsiva */}
      {!loading && documents.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between bg-white sm:border-t border-gray-200 px-2 sm:px-6 py-3">
          <div className="text-xs text-center sm:text-left text-gray-700">
            Mostrando <span className="font-medium">{((pagination.currentPage - 1) * 10) + 1}</span> até{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * 10, pagination.totalItems)}
            </span>{' '}
            de <span className="font-medium">{pagination.totalItems}</span> resultados
          </div>
          
          <div className="flex justify-center w-full sm:w-auto">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center rounded-l-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Anterior</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Em telas pequenas, mostrar apenas a página atual */}
              <div className="sm:hidden relative inline-flex items-center px-3 py-2 text-sm font-semibold bg-blue-600 text-white focus:z-20">
                {pagination.currentPage} de {pagination.totalPages}
              </div>
              
              {/* Em telas maiores, mostrar as páginas */}
              <div className="hidden sm:flex">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      pagination.currentPage === i + 1
                        ? 'z-10 bg-blue-600 text-white focus:z-20'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="relative inline-flex items-center rounded-r-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Próxima</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcervoDigital;