import { useTranslation } from 'react-i18next';
import api, { API_BASE_URL } from '../../services/api';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, Calendar, Link, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TwinCity {
  id: number;
  cityA_name: string;
  cityB_name: string;
}

interface IconOption {
  value: string;
  library: string;
  label: string;
}

interface Indicator {
  id: number;
  twin_city_id: number;
  cityA_name: string;
  cityB_name: string;
  category: string;
  title: string;
  study_date_start?: string;
  study_date_end?: string;
  source_title: string;
  source_link?: string;
  city_a_value: number;
  city_b_value: number;
  unit: string;
  icon?: string;
}

const ITEMS_PER_PAGE = 15;

const Indicators = () => {
  const { t } = useTranslation();
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [twinCities, setTwinCities] = useState<TwinCity[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [icons, setIcons] = useState<IconOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [formData, setFormData] = useState({
    twin_city_id: '',
    category: '',
    title: '',
    study_date_start: '',
    study_date_end: '',
    source_title: '',
    source_link: '',
    city_a_value: '',
    city_b_value: '',
    unit: '',
    icon: ''
  });
  const [filters, setFilters] = useState({
    twinCity: '',
    category: '',
    title: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Buscar indicadores
  const fetchIndicators = async () => {
    try {
      const response = await api.get('/indicators');
      setIndicators(response.data);
    } catch (error) {
      console.error('Erro ao buscar indicadores:', error);
    }
  };

  // Buscar cidades gêmeas
  const fetchTwinCities = async () => {
    try {
      const response = await api.get('/twin-cities');
      setTwinCities(response.data);
    } catch (error) {
      console.error('Erro ao buscar cidades gêmeas:', error);
    }
  };

  // Buscar categorias
  const fetchCategories = async () => {
    try {
      const response = await api.get('/indicators/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Buscar ícones disponíveis
  const fetchIcons = async () => {
    try {
      const response = await api.get('/indicators/icons');
      setIcons(response.data);
    } catch (error) {
      console.error('Erro ao buscar ícones:', error);
    }
  };

  useEffect(() => {
    fetchIndicators();
    fetchTwinCities();
    fetchCategories();
    fetchIcons();
  }, []);

  // Filtrar indicadores
  const filteredIndicators = indicators.filter(indicator => {
    const cityNames = `${indicator.cityA_name} ${indicator.cityB_name}`.toLowerCase();
    const matchesTwinCity = cityNames.includes(filters.twinCity.toLowerCase());
    const matchesCategory = filters.category === '' || indicator.category === filters.category;
    const matchesTitle = indicator.title.toLowerCase().includes(filters.title.toLowerCase());
    return matchesTwinCity && matchesCategory && matchesTitle;
  });

  // Calcular paginação
  const totalPages = Math.ceil(filteredIndicators.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIndicators = filteredIndicators.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Atualizar filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Resetar para primeira página quando filtrar
  };

  // Navegação da paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Abrir modal para edição
  const handleEdit = (indicator: Indicator) => {
    setSelectedIndicator(indicator);
    setFormData({
      twin_city_id: indicator.twin_city_id.toString(),
      category: indicator.category,
      title: indicator.title,
      study_date_start: indicator.study_date_start || '',
      study_date_end: indicator.study_date_end || '',
      source_title: indicator.source_title,
      source_link: indicator.source_link || '',
      city_a_value: indicator.city_a_value.toString(),
      city_b_value: indicator.city_b_value.toString(),
      unit: indicator.unit,
      icon: indicator.icon || ''
    });
    setShowModal(true);
  };

  // Abrir modal para novo indicador
  const handleAdd = () => {
    setSelectedIndicator(null);
    setFormData({
      twin_city_id: '',
      category: '',
      title: '',
      study_date_start: '',
      study_date_end: '',
      source_title: '',
      source_link: '',
      city_a_value: '',
      city_b_value: '',
      unit: '',
      icon: ''
    });
    setShowModal(true);
  };

  // Excluir indicador
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este indicador?')) {
      try {
        await api.delete(`/indicators/${id}`);
        fetchIndicators();
      } catch (error) {
        console.error('Erro ao excluir indicador:', error);
      }
    }
  };

  // Salvar indicador (criar ou atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        twin_city_id: parseInt(formData.twin_city_id),
        category: formData.category,
        title: formData.title,
        study_date_start: formData.study_date_start || null,
        study_date_end: formData.study_date_end || null,
        source_title: formData.source_title,
        source_link: formData.source_link || null,
        city_a_value: parseFloat(formData.city_a_value),
        city_b_value: parseFloat(formData.city_b_value),
        unit: formData.unit,
        icon: formData.icon || null
      };

      if (selectedIndicator) {
        // Atualizar indicador existente
        await api.put(`/indicators/${selectedIndicator.id}`, data);
      } else {
        // Criar novo indicador
        await api.post('/indicators', data);
      }

      setShowModal(false);
      fetchIndicators();
    } catch (error) {
      console.error('Erro ao salvar indicador:', error);
      alert('Erro ao salvar indicador. Verifique se todos os campos obrigatórios foram preenchidos.');
    }
  };

  // Atualizar dados do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Selecionar ícone
  const handleSelectIcon = (iconValue: string) => {
    setFormData(prev => ({
      ...prev,
      icon: iconValue
    }));
    setShowIconSelector(false);
  };

  // Encontrar cidade gêmea pelo ID
  const getTwinCityName = (twinCityId: number) => {
    const twinCity = twinCities.find(tc => tc.id === twinCityId);
    return twinCity ? `${twinCity.cityA_name} - ${twinCity.cityB_name}` : 'Desconhecido';
  };

  // Encontrar ícone pelo valor
  const getIconByValue = (iconValue: string) => {
    return icons.find(icon => icon.value === iconValue);
  };

  // Obter cor com base na categoria
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Demografia': 'blue',
      'Economia': 'green',
      'Educação': 'orange',
      'Saúde': 'red',
      'Infraestrutura': 'purple',
      'Segurança': 'yellow',
      'Meio Ambiente': 'emerald',
      'Turismo': 'indigo',
      'Cultura': 'pink'
    };
    
    return categoryColors[category] || 'gray';
  };

  // Renderizar lista de cards para mobile
  const renderMobileCards = () => {
    if (paginatedIndicators.length === 0) {
      return (
        <div className="bg-white rounded-lg py-8 px-4 text-center text-gray-500">
          Nenhum indicador encontrado.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {paginatedIndicators.map((indicator) => {
          const categoryColor = getCategoryColor(indicator.category);
          const colorClasses = {
            blue: 'border-l-blue-500 bg-blue-50',
            green: 'border-l-green-500 bg-green-50',
            orange: 'border-l-orange-500 bg-orange-50',
            red: 'border-l-red-500 bg-red-50',
            purple: 'border-l-purple-500 bg-purple-50',
            yellow: 'border-l-yellow-500 bg-yellow-50',
            emerald: 'border-l-emerald-500 bg-emerald-50',
            indigo: 'border-l-indigo-500 bg-indigo-50',
            pink: 'border-l-pink-500 bg-pink-50',
            gray: 'border-l-gray-500 bg-gray-50'
          };
          
          return (
            <div 
              key={indicator.id} 
              className={`bg-white rounded-lg shadow border border-gray-100 overflow-hidden border-l-4 ${colorClasses[categoryColor as keyof typeof colorClasses]}`}
            >
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div>
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium bg-${categoryColor}-100 text-${categoryColor}-800 mb-1`}>
                        {indicator.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900">
                      {indicator.title}
                    </h3>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">{indicator.cityA_name} - {indicator.cityB_name}</span>
                    </div>
                    <div className="text-sm space-y-1 mt-2">
                      <div className="flex justify-between">
                        <span className="text-xs">{indicator.cityA_name}:</span>
                        <span className="font-medium">{indicator.city_a_value} {indicator.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs">{indicator.cityB_name}:</span>
                        <span className="font-medium">{indicator.city_b_value} {indicator.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 shrink-0 ml-3">
                    <button
                      onClick={() => handleEdit(indicator)}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(indicator.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-xl font-bold">{t('admin.menu.indicators')}</h1>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-green-600 transition-colors text-sm w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4" />
          Adicionar Indicador
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* Filtros */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="twinCity"
              value={filters.twinCity}
              onChange={handleFilterChange}
              placeholder="Buscar por cidade..."
              className="pl-8 pr-3 py-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="Buscar por título..."
              className="pl-8 pr-3 py-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Versão mobile: cards */}
        <div className="sm:hidden">
          {renderMobileCards()}
        </div>

        {/* Versão desktop: tabela */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidades</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedIndicators.map((indicator) => (
                <tr key={indicator.id}>
                  <td className="px-4 py-2">
                    <div className="text-sm font-medium text-gray-900">{indicator.title}</div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium bg-${getCategoryColor(indicator.category)}-100 text-${getCategoryColor(indicator.category)}-800`}>
                      {indicator.category}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-600 truncate max-w-[120px]">{indicator.cityA_name} - {indicator.cityB_name}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(indicator)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Editar indicador"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(indicator.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir indicador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação responsiva */}
        {filteredIndicators.length > 0 && (
          <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between border-t border-gray-200 bg-white px-3 py-3 sm:px-4">
            <div className="text-xs text-center sm:text-left text-gray-700">
              Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredIndicators.length)}
              </span>{' '}
              de <span className="font-medium">{filteredIndicators.length}</span> resultados
            </div>
            
            <div className="flex justify-center w-full sm:w-auto">
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                
                {/* Em telas pequenas, mostrar apenas a página atual */}
                <div className="sm:hidden relative inline-flex items-center px-3 py-2 text-sm font-semibold bg-green-600 text-white focus:z-20">
                  {currentPage} de {totalPages}
                </div>
                
                {/* Em telas maiores, mostrar as páginas */}
                <div className="hidden sm:flex">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-3 py-1.5 text-xs font-semibold ${
                        currentPage === page
                          ? 'z-10 bg-green-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Próximo</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Modal para adicionar/editar indicador */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {selectedIndicator ? 'Editar Indicador' : 'Novo Indicador'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 text-xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cidades gêmeas */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Cidades Gêmeas <span className="text-red-500">*</span></label>
                <select
                  name="twin_city_id"
                  value={formData.twin_city_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione uma dupla de cidades</option>
                  {twinCities.map(twinCity => (
                    <option key={twinCity.id} value={twinCity.id}>
                      {twinCity.cityA_name} - {twinCity.cityB_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria <span className="text-red-500">*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Título da Informação <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {/* Data do Estudo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data Inicial do Estudo</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="study_date_start"
                      value={formData.study_date_start}
                      onChange={handleInputChange}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data Final do Estudo</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="study_date_end"
                      value={formData.study_date_end}
                      onChange={handleInputChange}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Fonte */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título da Fonte <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="source_title"
                    value={formData.source_title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Link da Fonte</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="source_link"
                      value={formData.source_link}
                      onChange={handleInputChange}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="https://exemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Valores das Cidades */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor Cidade A <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="any"
                    name="city_a_value"
                    value={formData.city_a_value}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor Cidade B <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="any"
                    name="city_b_value"
                    value={formData.city_b_value}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unidade de Medida <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Ex: km², R$, habitantes"
                    required
                  />
                </div>
              </div>

              {/* Ícone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Ícone</label>
                <div className="mt-1 flex">
                  <button
                    type="button"
                    onClick={() => setShowIconSelector(!showIconSelector)}
                    className="px-4 py-2 bg-gray-100 rounded-md flex items-center hover:bg-gray-200 transition-colors"
                  >
                    {formData.icon ? (
                      <>
                        <span className="mr-2">{getIconByValue(formData.icon)?.label || formData.icon}</span>
                      </>
                    ) : (
                      'Selecionar Ícone'
                    )}
                  </button>
                </div>
                
                {showIconSelector && (
                  <div className="mt-2 p-3 border rounded-md bg-gray-50 max-h-60 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => handleSelectIcon(icon.value)}
                        className={`p-2 rounded-md text-sm flex items-center justify-start ${
                          formData.icon === icon.value
                            ? 'bg-green-100 text-green-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <Info className="w-4 h-4 mr-2" />
                        {icon.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Indicators;