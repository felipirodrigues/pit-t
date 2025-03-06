import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Definir o tipo para um usuário
interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  pais: string;
}

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<User>({ id: 0, nome: '', email: '', telefone: '', cidade: '', pais: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post<User>('/users', formData);
      setUsers([...users, response.data]);
      setShowModal(false);
      setFormData({ id: 0, nome: '', email: '', telefone: '', cidade: '', pais: '' });
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.menu.users')}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Adicionar Usuário</button>
        <table className="min-w-full mt-4">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>País</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.telefone}</td>
                <td>{user.cidade}</td>
                <td>{user.pais}</td>
                <td>
                  <button className="text-blue-500">Editar</button>
                  <button className="text-green-500 ml-2">Visualizar</button>
                  <button className="text-red-500 ml-2">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Usuário</h2>
            <form onSubmit={handleAddUser}>
              <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome" className="block w-full mb-2" />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="block w-full mb-2" />
              <input type="tel" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="Telefone" className="block w-full mb-2" />
              <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} placeholder="Cidade" className="block w-full mb-2" />
              <input type="text" name="pais" value={formData.pais} onChange={handleInputChange} placeholder="País" className="block w-full mb-2" />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Salvar</button>
              <button type="button" onClick={() => setShowModal(false)} className="ml-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;