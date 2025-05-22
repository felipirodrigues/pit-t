import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Home, User, LogIn, AlertTriangle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AccessDenied: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obter informações sobre a permissão necessária do state
  const requiredRole = location.state?.requiredRole || 'admin';

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="bg-red-100 p-6 rounded-full">
            <Shield className="h-16 w-16 text-red-600" />
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {t('accessDenied.title', 'Acesso Negado')}
        </h2>
        
        <div className="mt-2 text-center text-md text-gray-600 space-y-2">
          <p>
            {t('accessDenied.message', 'Você não tem permissão para acessar esta área. Esta seção requer privilégios de administrador.')}
          </p>
          <div className="flex items-center justify-center p-2 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              Para acessar esta área, você precisa ter o papel <span className="font-bold">{requiredRole}</span>.
            </p>
          </div>
        </div>

        {user && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-semibold">Suas informações:</span>
            </div>
            <p className="text-sm text-gray-600">
              Nome: <span className="font-medium">{user.name}</span>
            </p>
            <p className="text-sm text-gray-600">
              Email: <span className="font-medium">{user.email}</span>
            </p>
            <p className="text-sm text-gray-600">
              Papel atual: <span className="font-medium text-red-600">{user.role}</span> 
              (Requer: <span className="font-medium text-green-600">{requiredRole}</span>)
            </p>
          </div>
        )}
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Home className="w-5 h-5 mr-2" />
            {t('accessDenied.backToHome', 'Voltar para a Página Inicial')}
          </Link>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {t('accessDenied.logout', 'Sair e fazer login com outra conta')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied; 