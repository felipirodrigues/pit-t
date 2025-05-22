const TwinCity = require('../models/TwinCity');

class TwinCityController {
  async index(req, res) {
    try {
      const twinCities = await TwinCity.findAll();
      res.json(twinCities);
    } catch (error) {
      console.error('Erro ao buscar cidades gêmeas:', error);
      res.status(500).json({ error: 'Erro ao buscar cidades gêmeas' });
    }
  }

  async show(req, res) {
    try {
      const twinCity = await TwinCity.findById(req.params.id);
      if (!twinCity) {
        return res.status(404).json({ error: 'Cidades gêmeas não encontradas' });
      }
      res.json(twinCity);
    } catch (error) {
      console.error('Erro ao buscar cidades gêmeas:', error);
      res.status(500).json({ error: 'Erro ao buscar cidades gêmeas' });
    }
  }

  async store(req, res) {
    try {
      // Validação dos campos obrigatórios
      const requiredFields = [
        'cityA_name', 'cityA_latitude', 'cityA_longitude',
        'cityB_name', 'cityB_latitude', 'cityB_longitude'
      ];
      
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios ausentes', 
          fields: missingFields 
        });
      }

      const twinCityData = {
        cityA_name: req.body.cityA_name,
        cityA_latitude: req.body.cityA_latitude,
        cityA_longitude: req.body.cityA_longitude,
        cityB_name: req.body.cityB_name,
        cityB_latitude: req.body.cityB_latitude,
        cityB_longitude: req.body.cityB_longitude,
        description: req.body.description || null
      };

      const twinCity = await TwinCity.create(twinCityData);
      res.status(201).json(twinCity);
    } catch (error) {
      console.error('Erro ao criar cidades gêmeas:', error);
      res.status(500).json({ error: 'Erro ao criar cidades gêmeas' });
    }
  }

  async update(req, res) {
    try {
      const twinCity = await TwinCity.findById(req.params.id);
      if (!twinCity) {
        return res.status(404).json({ error: 'Cidades gêmeas não encontradas' });
      }

      const twinCityData = {
        cityA_name: req.body.cityA_name || twinCity.cityA_name,
        cityA_latitude: req.body.cityA_latitude || twinCity.cityA_latitude,
        cityA_longitude: req.body.cityA_longitude || twinCity.cityA_longitude,
        cityB_name: req.body.cityB_name || twinCity.cityB_name,
        cityB_latitude: req.body.cityB_latitude || twinCity.cityB_latitude,
        cityB_longitude: req.body.cityB_longitude || twinCity.cityB_longitude,
        description: req.body.description !== undefined ? req.body.description : twinCity.description
      };

      const updatedTwinCity = await TwinCity.update(req.params.id, twinCityData);
      res.json(updatedTwinCity);
    } catch (error) {
      console.error('Erro ao atualizar cidades gêmeas:', error);
      res.status(500).json({ error: 'Erro ao atualizar cidades gêmeas' });
    }
  }

  async destroy(req, res) {
    try {
      const success = await TwinCity.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Cidades gêmeas não encontradas' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir cidades gêmeas:', error);
      res.status(500).json({ error: 'Erro ao excluir cidades gêmeas' });
    }
  }
}

module.exports = new TwinCityController(); 