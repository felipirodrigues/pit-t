const express = require('express');
const router = express.Router();
const DigitalCollectionController = require('../src/controllers/DigitalCollectionController');
const documentUploadMiddleware = require('../src/middlewares/documentUploadMiddleware');
const externalDocumentMiddleware = require('../src/middlewares/externalDocumentMiddleware');

// Listar todos os documentos (com filtros opcionais)
router.get('/', DigitalCollectionController.index);

// Buscar documentos por localidade
router.get('/location/:locationId', DigitalCollectionController.getByLocation);

// Buscar documentos por cidade gêmea
router.get('/twin-city/:twinCityId', DigitalCollectionController.getByTwinCity);

// Buscar todas as tags
router.get('/tags', DigitalCollectionController.getTags);

// Buscar um documento específico
router.get('/:id', DigitalCollectionController.show);

// Criar novo documento (upload tradicional com arquivo)
router.post('/', documentUploadMiddleware.single('file'), DigitalCollectionController.store);

// Criar novo documento externo (sem upload de arquivo)
router.post('/external', express.json(), externalDocumentMiddleware, DigitalCollectionController.store);

// Atualizar documento
router.put('/:id', documentUploadMiddleware.single('file'), DigitalCollectionController.update);

// Atualizar documento externo (sem upload de arquivo)
router.put('/external/:id', express.json(), externalDocumentMiddleware, DigitalCollectionController.update);

// Excluir documento
router.delete('/:id', DigitalCollectionController.destroy);

module.exports = router; 