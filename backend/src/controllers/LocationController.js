const Location = require('../models/Location');

class LocationController {
  async index(req, res) {
    try {
      const locations = await Location.findAll();
      res.json(locations);
    } catch (error) {
      console.error('Erro ao buscar localidades:', error);
      res.status(500).json({ error: 'Erro ao buscar localidades' });
    }
  }

  async show(req, res) {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        return res.status(404).json({ error: 'Localidade não encontrada' });
      }
      res.json(location);
    } catch (error) {
      console.error('Erro ao buscar localidade:', error);
      res.status(500).json({ error: 'Erro ao buscar localidade' });
    }
  }

  async store(req, res) {
    try {
      const locationData = {
        name: req.body.name,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        country: req.body.country,
        image_url: req.file ? `/uploads/locations/${req.file.filename}` : null
      };

      const location = await Location.create(locationData);
      res.status(201).json(location);
    } catch (error) {
      console.error('Erro ao criar localidade:', error);
      res.status(500).json({ error: 'Erro ao criar localidade' });
    }
  }

  async update(req, res) {
    try {
      const locationData = {
        name: req.body.name,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        country: req.body.country
      };

      if (req.file) {
        locationData.image_url = `/uploads/locations/${req.file.filename}`;
      }

      const location = await Location.update(req.params.id, locationData);
      if (!location) {
        return res.status(404).json({ error: 'Localidade não encontrada' });
      }
      res.json(location);
    } catch (error) {
      console.error('Erro ao atualizar localidade:', error);
      res.status(500).json({ error: 'Erro ao atualizar localidade' });
    }
  }

  async destroy(req, res) {
    try {
      const success = await Location.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Localidade não encontrada' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir localidade:', error);
      res.status(500).json({ error: 'Erro ao excluir localidade' });
    }
  }
}

module.exports = new LocationController(); 