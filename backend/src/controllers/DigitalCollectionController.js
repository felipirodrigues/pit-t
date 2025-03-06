const DigitalCollection = require('../models/DigitalCollection');
const path = require('path');

class DigitalCollectionController {
  async index(req, res) {
    try {
      console.log('=== Início da requisição GET /digital-collection ===');
      console.log('Query params recebidos:', req.query);
      
      const filters = {
        search: req.query.search || '',
        category: req.query.category || '',
        location_id: req.query.location_id || '',
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      console.log('Filtros processados:', filters);

      const result = await DigitalCollection.findAll(filters);
      
      console.log('Resultado da busca:', {
        totalDocuments: result.total,
        documentsRetornados: result.documents.length,
        primeiroDocumento: result.documents[0],
      });

      const response = {
        documents: result.documents,
        total: result.total,
        page: filters.page,
        limit: filters.limit
      };

      console.log('Resposta sendo enviada:', response);
      res.json(response);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      res.status(500).json({ error: 'Erro ao buscar documentos: ' + error.message });
    }
  }

  async show(req, res) {
    try {
      const document = await DigitalCollection.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }
      res.json(document);
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      res.status(500).json({ error: 'Erro ao buscar documento' });
    }
  }

  async store(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
      }

      if (!req.body.location_id) {
        return res.status(400).json({ error: 'A localidade é obrigatória' });
      }

      const documentData = {
        title: req.body.title,
        author: req.body.author,
        publication_year: parseInt(req.body.publication_year),
        category: req.body.category,
        location_id: parseInt(req.body.location_id),
        file_url: `/uploads/documents/${req.file.filename}`,
        file_type: path.extname(req.file.originalname).substring(1),
        file_size: req.file.size
      };

      // Validar campos obrigatórios
      const requiredFields = ['title', 'author', 'publication_year', 'category'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios ausentes', 
          fields: missingFields 
        });
      }

      const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
      
      try {
        const document = await DigitalCollection.create(documentData, tags);
        res.status(201).json(document);
      } catch (error) {
        if (error.message === 'Localidade não encontrada') {
          return res.status(404).json({ error: 'Localidade não encontrada' });
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      res.status(500).json({ error: 'Erro ao criar documento' });
    }
  }

  async update(req, res) {
    try {
      if (!req.body.location_id) {
        return res.status(400).json({ error: 'A localidade é obrigatória' });
      }

      const documentData = {
        title: req.body.title,
        author: req.body.author,
        publication_year: parseInt(req.body.publication_year),
        category: req.body.category,
        location_id: parseInt(req.body.location_id)
      };

      // Validar campos obrigatórios
      const requiredFields = ['title', 'author', 'publication_year', 'category'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios ausentes', 
          fields: missingFields 
        });
      }

      if (req.file) {
        documentData.file_url = `/uploads/documents/${req.file.filename}`;
        documentData.file_type = path.extname(req.file.originalname).substring(1);
        documentData.file_size = req.file.size;
      }

      const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
      
      try {
        const document = await DigitalCollection.update(req.params.id, documentData, tags);
        if (!document) {
          return res.status(404).json({ error: 'Documento não encontrado' });
        }
        res.json(document);
      } catch (error) {
        if (error.message === 'Localidade não encontrada') {
          return res.status(404).json({ error: 'Localidade não encontrada' });
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      res.status(500).json({ error: 'Erro ao atualizar documento' });
    }
  }

  async destroy(req, res) {
    try {
      const success = await DigitalCollection.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      res.status(500).json({ error: 'Erro ao excluir documento' });
    }
  }

  async getTags(req, res) {
    try {
      const tags = await DigitalCollection.findTags();
      res.json(tags);
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      res.status(500).json({ error: 'Erro ao buscar tags' });
    }
  }

  async getByLocation(req, res) {
    try {
      console.log('=== Início da requisição GET /digital-collection/location/:locationId ===');
      console.log('Parâmetros recebidos:', req.params);
      
      const locationId = parseInt(req.params.locationId);
      
      if (isNaN(locationId)) {
        console.log('ID da localidade inválido:', req.params.locationId);
        return res.status(400).json({ error: 'ID da localidade inválido' });
      }

      console.log('Buscando documentos para a localidade:', locationId);
      const documents = await DigitalCollection.findByLocationId(locationId);
      console.log('Documentos encontrados:', {
        quantidade: documents.length,
        documentos: documents
      });
      
      if (!documents || documents.length === 0) {
        console.log('Nenhum documento encontrado para a localidade');
        return res.json([]);
      }

      console.log('Enviando resposta com', documents.length, 'documentos');
      res.json(documents);
    } catch (error) {
      console.error('Erro ao buscar documentos da localidade:', error);
      res.status(500).json({ error: 'Erro ao buscar documentos da localidade' });
    }
  }
}

module.exports = new DigitalCollectionController(); 