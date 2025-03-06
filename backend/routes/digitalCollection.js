const express = require('express');
const router = express.Router();
const DigitalCollectionController = require('../src/controllers/DigitalCollectionController');
const documentUploadMiddleware = require('../src/middlewares/documentUploadMiddleware');

// Listar todos os documentos (com filtros opcionais)
router.get('/', DigitalCollectionController.index);

// Buscar documentos por localidade
router.get('/location/:locationId', DigitalCollectionController.getByLocation);

// Buscar todas as tags
router.get('/tags', DigitalCollectionController.getTags);

// Buscar um documento específico
router.get('/:id', DigitalCollectionController.show);

// Criar novo documento
router.post('/', documentUploadMiddleware.single('file'), DigitalCollectionController.store);

// Atualizar documento
router.put('/:id', documentUploadMiddleware.single('file'), DigitalCollectionController.update);

// Excluir documento
router.delete('/:id', DigitalCollectionController.destroy);

module.exports = router; 