import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface JwtPayload {
  id: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para realizar logout - Definida fora do checkAuth para evitar referência circular
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    // Limpar cookies relacionados à autenticação, se houver
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    
    // Forçar uma pausa para garantir que todos os dados sejam limpos
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  }, []);

  // Verificar se o token está expirado
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // Verificar se o token expirou (timestamp atual em segundos > exp)
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return true; // Se não for possível decodificar, considerar como expirado
    }
  };

  // Verificar a autenticação atual
  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      return false;
    }

    // Verificar se o token está expirado
    if (isTokenExpired(token)) {
      console.error('Token expirado, realizando logout');
      logout();
      return false;
    }

    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Verificar se os dados do usuário estão completos
        if (parsedUser && parsedUser.id && parsedUser.role) {
          // Verificar se o token ainda é válido fazendo uma requisição ao backend
          try {
            await api.get('/users/auth/me');
            setUser(parsedUser);
            return true;
          } catch (error) {
            // Se houver erro na requisição, o token pode estar inválido
            console.error('Token inválido ou expirado:', error);
            logout();
            return false;
          }
        }
      }

      // Se houver apenas token mas não o usuário, buscar os dados 
      const response = await api.get('/users/auth/me');
      
      // Verificar se a resposta contém os dados esperados
      if (response.data && response.data.id) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return true;
      } else {
        throw new Error('Dados do usuário incompletos');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      logout();
      return false;
    }
  }, [logout]);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkUserAuthentication = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    checkUserAuthentication();
  }, [checkAuth]);

  // Função para realizar login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/users/login', { email, password });
      
      const { token, user } = response.data;
      
      // Verificar se o token e o usuário são válidos
      if (!token || !user || !user.id || !user.role) {
        throw new Error('Resposta de login inválida');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}; 