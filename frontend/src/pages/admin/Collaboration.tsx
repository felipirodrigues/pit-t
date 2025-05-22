import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Trash2, Eye, FileText, Loader, Search, X, Check, AlertTriangle } from 'lucide-react';
import api, { API_BASE_URL } from '../../services/api';

// Interface para o tipo de colaboração
interface CollaborationItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  //status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
  files: CollaborationFile[];
}

// Interface para os arquivos anexados
interface CollaborationFile {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

const Collaboration = () => {
  const { t } = useTranslation();
  const [collaborations, setCollaborations] = useState<CollaborationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [viewingCollaboration, setViewingCollaboration] = useState<CollaborationItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Função para carregar as colaborações
  const fetchCollaborations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = new URLSearchParams();
      filters.append('page', currentPage.toString());
      filters.append('limit', '10');
      
      if (searchTerm) {
        filters.append('search', searchTerm);
      }
      
      //if (selectedStatus) {
      //  filters.append('status', selectedStatus);
      //}
      
      const response = await api.get(`/collaborations?${filters.toString()}`);
      setCollaborations(response.data);
      
      // Para um sistema real, a API deveria retornar informações de paginação
      // Por enquanto, estamos apenas simulando com base no número de resultados
      setTotalPages(Math.ceil(response.data.length / 10) || 1);
    } catch (err: any) {
      console.error('Erro ao buscar colaborações:', err);
      setError(err.response?.data?.error || 'Erro ao carregar colaborações');
    } finally {
      setLoading(false);
    }
  };

  // Carregar colaborações quando a página iniciar ou os filtros mudarem
  useEffect(() => {
    fetchCollaborations();
  }, [currentPage, searchTerm, selectedStatus]);

  // Função para visualizar uma colaboração específica
  const viewCollaboration = (collaboration: CollaborationItem) => {
    setViewingCollaboration(collaboration);
  };

  // Função para fechar o modal de visualização
  const closeViewModal = () => {
    setViewingCollaboration(null);
  };

  // Função para confirmar exclusão
  const confirmDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  // Função para cancelar exclusão
  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Função para excluir uma colaboração
  const deleteCollaboration = async (id: number) => {
    setIsDeleting(true);
    
    try {
      await api.delete(`/collaborations/${id}`);
      setCollaborations(collaborations.filter(c => c.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error('Erro ao excluir colaboração:', err);
      setError(err.response?.data?.error || 'Erro ao excluir colaboração');
    } finally {
      setIsDeleting(false);
    }
  };

  

  // Formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatar o tamanho do arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Traduzir o status
  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'reviewed': return 'Revisado';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.menu.collaboration')}</h1>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, email ou assunto..."
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtro de status */}
          <div className="w-full sm:w-48">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="reviewed">Revisado</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de colaborações */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : collaborations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma colaboração encontrada
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assunto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  {/*<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>*/}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anexos
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {collaborations.map((collaboration) => (
                  <tr key={collaboration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">{collaboration.name}</div>
                        <div className="text-gray-500 text-sm">{collaboration.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {collaboration.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(collaboration.created_at)}
                    </td>
                    {/*<td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(collaboration.status)}`}>
                        {translateStatus(collaboration.status)}
                      </span>
                    </td>*/}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {collaboration.files?.length > 0 ? (
                        <span className="inline-flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {collaboration.files.length}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => viewCollaboration(collaboration)}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        
                        {deleteConfirmId === collaboration.id ? (
                          <>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => deleteCollaboration(collaboration.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <Loader className="h-5 w-5 animate-spin" />
                              ) : (
                                <Check className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              onClick={cancelDelete}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => confirmDelete(collaboration.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Paginação */}
        {!loading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{collaborations.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Anterior</span>
                    &larr;
                  </button>
                  
                  {/* Números de página */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Próxima</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de visualização de colaboração */}
      {viewingCollaboration && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeViewModal}></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Detalhes da Colaboração
                      </h3>
                      <div className="space-x-2">
                        {/* Botões de atualização de status */}
                        {/*<button
                          className={`px-2 py-1 text-xs rounded ${viewingCollaboration.status === 'reviewed' ? 'bg-blue-500 text-white' : 'border border-blue-500 text-blue-500'}`}
                          onClick={() => updateStatus(viewingCollaboration.id, 'reviewed')}
                        >
                          Revisar
                        </button>
                        <button
                          className={`px-2 py-1 text-xs rounded ${viewingCollaboration.status === 'approved' ? 'bg-green-500 text-white' : 'border border-green-500 text-green-500'}`}
                          onClick={() => updateStatus(viewingCollaboration.id, 'approved')}
                        >
                          Aprovar
                        </button>
                        <button
                          className={`px-2 py-1 text-xs rounded ${viewingCollaboration.status === 'rejected' ? 'bg-red-500 text-white' : 'border border-red-500 text-red-500'}`}
                          onClick={() => updateStatus(viewingCollaboration.id, 'rejected')}
                        >
                          Rejeitar
                        </button>*/}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-500">Nome</p>
                            <p className="mt-1">{viewingCollaboration.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-500">Email</p>
                            <p className="mt-1">{viewingCollaboration.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-500">Telefone</p>
                            <p className="mt-1">{viewingCollaboration.phone || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-500">Data</p>
                            <p className="mt-1">{formatDate(viewingCollaboration.created_at)}</p>
                          </div>
                          {/*<div>
                            <p className="text-sm font-semibold text-gray-500">Status</p>
                            <p className="mt-1">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(viewingCollaboration.status)}`}>
                                {translateStatus(viewingCollaboration.status)}
                              </span>
                            </p>
                          </div>*/}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Assunto</p>
                        <p className="mt-1">{viewingCollaboration.subject}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Mensagem</p>
                        <div className="mt-1 bg-gray-50 p-4 rounded-md overflow-auto max-h-40">
                          <p className="whitespace-pre-wrap">{viewingCollaboration.message}</p>
                        </div>
                      </div>
                      
                      {viewingCollaboration.files && viewingCollaboration.files.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-500">Arquivos Anexados</p>
                          <div className="mt-2 space-y-2">
                            {viewingCollaboration.files.map((file) => (
                              <div key={file.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.file_name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.file_size)}
                                  </p>
                                </div>
                                <a
                                  href={`${API_BASE_URL}${file.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-4 flex-shrink-0 bg-white rounded-md p-1 text-blue-600 hover:text-blue-800"
                                >
                                  <Eye className="h-5 w-5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeViewModal}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaboration;