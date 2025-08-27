import axios from 'axios';

// Configuração da API dinâmica baseada no ambiente
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Desenvolvimento: localhost
    return 'http://localhost:3000';
  } else {
    // Produção: mesma origem (mesmo servidor)
    return window.location.origin;
  }
};

export const API_BASE_URL = getApiBaseUrl();

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