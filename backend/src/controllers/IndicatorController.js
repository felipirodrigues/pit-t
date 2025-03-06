const Indicator = require('../models/Indicator');

class IndicatorController {
  async index(req, res) {
    try {
      if (req.query.location_id) {
        const indicators = await Indicator.findByLocationId(req.query.location_id);
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
      const indicatorData = {
        location_id: req.body.location_id,
        title: req.body.title,
        value: req.body.value,
        unit: req.body.unit
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
      const indicatorData = {
        location_id: req.body.location_id,
        title: req.body.title,
        value: req.body.value,
        unit: req.body.unit
      };

      const indicator = await Indicator.update(req.params.id, indicatorData);
      if (!indicator) {
        return res.status(404).json({ error: 'Indicador não encontrado' });
      }
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
}

module.exports = new IndicatorController(); 