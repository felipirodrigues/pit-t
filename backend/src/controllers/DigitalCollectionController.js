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
        twin_city_id: req.query.twin_city_id || '',
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
      console.log('=== Iniciando store ===');
      console.log('Body:', req.body);
      console.log('File:', req.file);
      console.log('Rota utilizada:', req.originalUrl);
      
      // Verificar se o tipo de documento foi especificado
      const documentKind = req.body.kind || 'internal';
      console.log('Tipo de documento:', documentKind);
      
      if (documentKind !== 'internal' && documentKind !== 'external') {
        return res.status(400).json({ error: 'Tipo de documento inválido. Use "internal" ou "external"' });
      }
      
      // Verificar requisitos para cada tipo de documento
      if (documentKind === 'internal' && !req.file) {
        console.log('Erro: Documento interno sem arquivo');
        return res.status(400).json({ error: 'Para documentos internos é necessário enviar um arquivo' });
      }
      
      if (documentKind === 'external' && !req.body.external_url) {
        console.log('Erro: Documento externo sem URL');
        return res.status(400).json({ error: 'Para documentos externos é necessário fornecer external_url' });
      }

      if (!req.body.twin_city_id) {
        console.log('Erro: Sem twin_city_id');
        return res.status(400).json({ error: 'É necessário fornecer twin_city_id' });
      }

      // Preparar dados básicos do documento
      const documentData = {
        title: req.body.title,
        author: req.body.author,
        publication_year: parseInt(req.body.publication_year),
        category: req.body.category,
        location_id: null,
        twin_city_id: req.body.twin_city_id ? parseInt(req.body.twin_city_id) : null,
        kind: documentKind
      };
      
      console.log('Dados básicos do documento:', documentData);
      
      // Adicionar dados específicos conforme o tipo de documento
      if (documentKind === 'internal' && req.file) {
        documentData.file_url = `/uploads/documents/${req.file.filename}`;
        documentData.file_type = path.extname(req.file.originalname).substring(1);
        documentData.file_size = req.file.size;
        documentData.external_url = null;
        console.log('Dados de arquivo interno adicionados:', {
          file_url: documentData.file_url,
          file_type: documentData.file_type,
          file_size: documentData.file_size
        });
      } else if (documentKind === 'external') {
        documentData.external_url = req.body.external_url;
        documentData.file_url = '';
        documentData.file_type = req.body.file_type || path.extname(req.body.external_url).substring(1) || 'unknown';
        documentData.file_size = 0;
        console.log('Dados de documento externo adicionados:', {
          external_url: documentData.external_url,
          file_type: documentData.file_type
        });
      }

      // Validar campos obrigatórios
      const requiredFields = ['title', 'author', 'publication_year', 'category'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        console.log('Campos obrigatórios ausentes:', missingFields);
        return res.status(400).json({ 
          error: 'Campos obrigatórios ausentes', 
          fields: missingFields 
        });
      }

      const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
      console.log('Tags a serem associadas:', tags);
      
      try {
        console.log('Criando documento no banco de dados...');
        const document = await DigitalCollection.create(documentData, tags);
        console.log('Documento criado com sucesso:', document);
        res.status(201).json(document);
      } catch (error) {
        console.error('Erro ao criar no banco:', error);
        if (error.message === 'Cidade gêmea não encontrada') {
          return res.status(404).json({ error: 'Cidade gêmea não encontrada' });
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      res.status(500).json({ error: 'Erro ao criar documento: ' + error.message });
    }
  }

  async update(req, res) {
    try {
      // Verificar se o tipo de documento foi especificado
      const documentKind = req.body.kind || 'internal';
      
      if (documentKind !== 'internal' && documentKind !== 'external') {
        return res.status(400).json({ error: 'Tipo de documento inválido. Use "internal" ou "external"' });
      }
      
      // Para documentos externos, verificar se há URL externa
      if (documentKind === 'external' && !req.body.external_url) {
        return res.status(400).json({ error: 'Para documentos externos é necessário fornecer external_url' });
      }

      if (!req.body.twin_city_id) {
        return res.status(400).json({ error: 'É necessário fornecer twin_city_id' });
      }

      // Preparar dados básicos do documento
      const documentData = {
        title: req.body.title,
        author: req.body.author,
        publication_year: parseInt(req.body.publication_year),
        category: req.body.category,
        location_id: null,
        twin_city_id: req.body.twin_city_id ? parseInt(req.body.twin_city_id) : null,
        kind: documentKind
      };
      
      // Adicionar dados específicos conforme o tipo de documento
      if (documentKind === 'internal') {
        if (req.file) {
          documentData.file_url = `/uploads/documents/${req.file.filename}`;
          documentData.file_type = path.extname(req.file.originalname).substring(1);
          documentData.file_size = req.file.size;
        }
        documentData.external_url = null;
      } else if (documentKind === 'external') {
        documentData.external_url = req.body.external_url;
        // Se estiver convertendo de interno para externo, limpar os dados de arquivo
        documentData.file_url = '';
        documentData.file_type = req.body.file_type || path.extname(req.body.external_url).substring(1) || 'unknown';
        documentData.file_size = 0;
      }

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
        const document = await DigitalCollection.update(req.params.id, documentData, tags);
        if (!document) {
          return res.status(404).json({ error: 'Documento não encontrado' });
        }
        res.json(document);
      } catch (error) {
        if (error.message === 'Cidade gêmea não encontrada') {
          return res.status(404).json({ error: 'Cidade gêmea não encontrada' });
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

  async getByTwinCity(req, res) {
    try {
      console.log('=== Início da requisição GET /digital-collection/twin-city/:twinCityId ===');
      console.log('Parâmetros recebidos:', req.params);
      
      const twinCityId = parseInt(req.params.twinCityId);
      
      if (isNaN(twinCityId)) {
        console.log('ID da cidade gêmea inválido:', req.params.twinCityId);
        return res.status(400).json({ error: 'ID da cidade gêmea inválido' });
      }

      console.log('Buscando documentos para a cidade gêmea:', twinCityId);
      const documents = await DigitalCollection.findByTwinCityId(twinCityId);
      console.log('Documentos encontrados:', {
        quantidade: documents.length,
        documentos: documents
      });
      
      if (!documents || documents.length === 0) {
        console.log('Nenhum documento encontrado para a cidade gêmea');
        return res.json([]);
      }

      console.log('Enviando resposta com', documents.length, 'documentos');
      res.json(documents);
    } catch (error) {
      console.error('Erro ao buscar documentos da cidade gêmea:', error);
      res.status(500).json({ error: 'Erro ao buscar documentos da cidade gêmea' });
    }
  }
}

module.exports = new DigitalCollectionController(); 