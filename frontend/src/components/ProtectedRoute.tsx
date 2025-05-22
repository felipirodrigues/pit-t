import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, user, isLoading, checkAuth } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  // Verificar autenticação ao carregar o componente
  useEffect(() => {
    const verifyAuth = async () => {
      // Forçar uma nova verificação de autenticação
      await checkAuth();
      setAuthChecked(true);
    };

    verifyAuth();
  }, [checkAuth, location.pathname]);

  // Exibir indicador de carregamento enquanto verifica a autenticação
  if (isLoading || !authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Verificar se a rota requer privilégios de administrador
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/acesso-negado" state={{ requiredRole: 'admin' }} replace />;
  }

  // Se estiver autenticado e tiver as permissões necessárias, renderizar as rotas filhas
  return <>{children}</>;
};

export default ProtectedRoute; 