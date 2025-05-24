import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { Pencil, Trash2, Plus, Eye, Loader } from 'lucide-react';

// Definir o tipo para um usuário
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{ id: number; name: string; email: string; password?: string }>({ 
    id: 0, 
    name: '', 
    email: '', 
    password: '' 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (isEditing && selectedUser) {
        // Editar usuário existente
        const updateData = {
          name: formData.name,
          email: formData.email,
          ...(formData.password && { password: formData.password })
        };
        const response = await api.put<User>(`/users/${selectedUser.id}`, updateData);
        setUsers(users.map(user => user.id === selectedUser.id ? response.data : user));
      } else {
        // Criar novo usuário
        const response = await api.post<User>('/users', formData);
        setUsers([...users, response.data]);
      }
      
      setShowModal(false);
      setIsEditing(false);
      setSelectedUser(null);
      setFormData({ id: 0, name: '', email: '', password: '' });
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({ 
      id: user.id, 
      name: user.name, 
      email: user.email,
      password: '' 
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário. Verifique se não é o último administrador do sistema.');
      }
    }
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({ id: 0, name: '', email: '', password: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({ id: 0, name: '', email: '', password: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('admin.menu.users')}</h1>
        <button 
          onClick={handleAddNew}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Usuário
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="w-6 h-6 animate-spin" />
            <span className="ml-2">Carregando usuários...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Data de Criação</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para adicionar/editar usuário */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
            </h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Nome completo" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="email@exemplo.com" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEditing ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder={isEditing ? "Digite uma nova senha" : "Digite a senha"} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required={!isEditing}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;