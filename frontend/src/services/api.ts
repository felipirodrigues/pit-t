import axios from 'axios';

// Configuração da API usando localhost para desenvolvimento
export const API_BASE_URL = 'http://10.10.10.136:3000';

// Criar instância do axios com configuração básica
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api; 