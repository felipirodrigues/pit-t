import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, ArrowRight, LogOut } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated, user, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Verificar se o usuário quer forçar o login
  const forceLogin = searchParams.get('force') === 'true';
  
  // Verificar estado da navegação para redirecionamento após login
  const from = location.state?.from?.pathname || '/';

  // Redirecionar se já estiver autenticado e não estiver forçando login
  useEffect(() => {
    if (isAuthenticated && !forceLogin) {
      // Se o usuário for admin, sempre redirecionar para /admin
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (from.startsWith('/admin') && user?.role !== 'admin') {
        // Se tentou acessar /admin mas não é admin, vai para home
        navigate('/', { replace: true });
      } else {
        // Usuário comum vai para a origem ou home
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from, user, forceLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Usar a função login do contexto de autenticação
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // O redirecionamento será tratado pelo useEffect
      } else {
        setError(t('Credenciais inválidas'));
      }
    } catch (error) {
      console.error(error);
      setError(t('Erro ao realizar login. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    // O redirecionamento será tratado pela função logout
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {isAuthenticated && !forceLogin ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <User className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Você já está logado</h2>
            <p className="mb-4 text-gray-600">
              Você já está logado como <span className="font-medium">{user?.name}</span> ({user?.email})
            </p>
            <p className="mb-6 text-gray-600">
              Seu papel atual é: <span className="font-medium">{user?.role}</span>
            </p>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleLogout}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair desta conta
              </button>
              
              <button
                onClick={() => navigate('/auth?force=true')}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Mail className="w-4 h-4 mr-2" />
                Entrar com outra conta
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Voltar para a página inicial
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-center text-3xl font-bold text-gray-900">
                {isLogin ? t('auth.login.title') : t('auth.register.title')}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {isLogin ? t('auth.login.subtitle') : t('auth.register.subtitle')}
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="sr-only">
                      {t('auth.form.name')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={t('auth.form.namePlaceholder')}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="sr-only">
                    {t('auth.form.email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t('auth.form.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    {t('auth.form.password')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t('auth.form.passwordPlaceholder')}
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">
                      {t('auth.form.confirmPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={t('auth.form.confirmPasswordPlaceholder')}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <ArrowRight className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                    )}
                  </span>
                  {isLogin ? t('auth.login.submit') : t('auth.register.submit')}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  {isLogin ? t('auth.login.switchToRegister') : t('auth.register.switchToLogin')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;