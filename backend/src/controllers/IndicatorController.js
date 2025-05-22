const Indicator = require('../models/Indicator');
const TwinCity = require('../models/TwinCity');

class IndicatorController {
  async index(req, res) {
    try {
      if (req.query.twin_city_id) {
        const indicators = await Indicator.findByTwinCityId(req.query.twin_city_id);
        return res.json(indicators);
      }
      
      if (req.query.category) {
        const indicators = await Indicator.findByCategory(req.query.category);
        return res.json(indicators);
      }
      
      const indicators = await Indicator.findAll();
      res.json(indicators);
    } catch (error) {
      console.error('Erro ao buscar indicadores:', error);
      res.status(500).json({ error: 'Erro ao buscar indicadores' });
    }
  }

  async show(req, res) {
    try {
      const indicator = await Indicator.findById(req.params.id);
      if (!indicator) {
        return res.status(404).json({ error: 'Indicador não encontrado' });
      }
      res.json(indicator);
    } catch (error) {
      console.error('Erro ao buscar indicador:', error);
      res.status(500).json({ error: 'Erro ao buscar indicador' });
    }
  }

  async store(req, res) {
    try {
      // Validando campos obrigatórios
      const requiredFields = [
        'twin_city_id', 'category', 'title', 'source_title',
        'city_a_value', 'city_b_value', 'unit'
      ];
      
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ 
            error: `Campo obrigatório ausente: ${field}` 
          });
        }
      }

      // Validar se a cidade gêmea existe
      const twinCity = await TwinCity.findById(req.body.twin_city_id);
      if (!twinCity) {
        return res.status(400).json({ error: 'Cidade gêmea não encontrada' });
      }

      // Validar a categoria
      const validCategories = ['Saúde', 'População', 'Comércio', 'Educação', 'Meio Ambiente'];
      if (!validCategories.includes(req.body.category)) {
        return res.status(400).json({ 
          error: 'Categoria inválida',
          validCategories
        });
      }

      const indicatorData = {
        twin_city_id: req.body.twin_city_id,
        category: req.body.category,
        title: req.body.title,
        study_date_start: req.body.study_date_start,
        study_date_end: req.body.study_date_end,
        source_title: req.body.source_title,
        source_link: req.body.source_link,
        city_a_value: req.body.city_a_value,
        city_b_value: req.body.city_b_value,
        unit: req.body.unit,
        icon: req.body.icon
      };

      const indicator = await Indicator.create(indicatorData);
      res.status(201).json(indicator);
    } catch (error) {
      console.error('Erro ao criar indicador:', error);
      res.status(500).json({ error: 'Erro ao criar indicador' });
    }
  }

  async update(req, res) {
    try {
      // Verificar se o indicador existe
      const existingIndicator = await Indicator.findById(req.params.id);
      if (!existingIndicator) {
        return res.status(404).json({ error: 'Indicador não encontrado' });
      }
      
      // Validar se a cidade gêmea existe (se fornecida)
      if (req.body.twin_city_id) {
        const twinCity = await TwinCity.findById(req.body.twin_city_id);
        if (!twinCity) {
          return res.status(400).json({ error: 'Cidade gêmea não encontrada' });
        }
      }

      // Validar a categoria (se fornecida)
      if (req.body.category) {
        const validCategories = ['Saúde', 'População', 'Comércio', 'Educação', 'Meio Ambiente'];
        if (!validCategories.includes(req.body.category)) {
          return res.status(400).json({ 
            error: 'Categoria inválida',
            validCategories
          });
        }
      }

      const indicatorData = {
        twin_city_id: req.body.twin_city_id || existingIndicator.twin_city_id,
        category: req.body.category || existingIndicator.category,
        title: req.body.title || existingIndicator.title,
        study_date_start: req.body.study_date_start !== undefined ? req.body.study_date_start : existingIndicator.study_date_start,
        study_date_end: req.body.study_date_end !== undefined ? req.body.study_date_end : existingIndicator.study_date_end,
        source_title: req.body.source_title || existingIndicator.source_title,
        source_link: req.body.source_link !== undefined ? req.body.source_link : existingIndicator.source_link,
        city_a_value: req.body.city_a_value !== undefined ? req.body.city_a_value : existingIndicator.city_a_value,
        city_b_value: req.body.city_b_value !== undefined ? req.body.city_b_value : existingIndicator.city_b_value,
        unit: req.body.unit || existingIndicator.unit,
        icon: req.body.icon !== undefined ? req.body.icon : existingIndicator.icon
      };

      const indicator = await Indicator.update(req.params.id, indicatorData);
      res.json(indicator);
    } catch (error) {
      console.error('Erro ao atualizar indicador:', error);
      res.status(500).json({ error: 'Erro ao atualizar indicador' });
    }
  }

  async destroy(req, res) {
    try {
      const success = await Indicator.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Indicador não encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir indicador:', error);
      res.status(500).json({ error: 'Erro ao excluir indicador' });
    }
  }
  
  // Método para listar categorias disponíveis
  async listCategories(req, res) {
    try {
      const categories = ['Saúde', 'População', 'Comércio', 'Educação', 'Meio Ambiente'];
      res.json(categories);
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({ error: 'Erro ao listar categorias' });
    }
  }
  
  // Método para listar ícones disponíveis
  async listIcons(req, res) {
    try {
      // Aqui listamos ícones populares de diversas bibliotecas
      // Formato: { value: 'nome-do-icone', library: 'biblioteca', label: 'Nome amigável do ícone' }
      const icons = [
        // Lucide Icons (usado no projeto)
        { value: 'activity', library: 'lucide', label: 'Atividade' },
        { value: 'alert-circle', library: 'lucide', label: 'Alerta' },
        { value: 'award', library: 'lucide', label: 'Prêmio' },
        { value: 'book', library: 'lucide', label: 'Livro' },
        { value: 'building', library: 'lucide', label: 'Prédio' },
        { value: 'calendar', library: 'lucide', label: 'Calendário' },
        { value: 'chart-bar', library: 'lucide', label: 'Gráfico de Barras' },
        { value: 'dollar-sign', library: 'lucide', label: 'Cifrão' },
        { value: 'droplet', library: 'lucide', label: 'Gota' },
        { value: 'graduation-cap', library: 'lucide', label: 'Formatura' },
        { value: 'heart', library: 'lucide', label: 'Coração' },
        { value: 'leaf', library: 'lucide', label: 'Folha' },
        { value: 'pencil', library: 'lucide', label: 'Lápis' },
        { value: 'pie-chart', library: 'lucide', label: 'Gráfico de Pizza' },
        { value: 'school', library: 'lucide', label: 'Escola' },
        { value: 'stethoscope', library: 'lucide', label: 'Estetoscópio' },
        { value: 'thermometer', library: 'lucide', label: 'Termômetro' },
        { value: 'trending-up', library: 'lucide', label: 'Tendência de Alta' },
        { value: 'tree', library: 'lucide', label: 'Árvore' },
        { value: 'users', library: 'lucide', label: 'Usuários' },
      ];
      
      res.json(icons);
    } catch (error) {
      console.error('Erro ao listar ícones:', error);
      res.status(500).json({ error: 'Erro ao listar ícones' });
    }
  }
}

module.exports = new IndicatorController(); 