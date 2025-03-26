const express = require('express');
const router = express.Router();
const CollaborationController = require('../src/controllers/CollaborationController');

// Rota para criar nova colaboração
router.post('/', CollaborationController.create);

// Rota para listar todas as colaborações
router.get('/', CollaborationController.list);

// Rota para buscar colaboração por ID
router.get('/:id', CollaborationController.getById);

// Rota para deletar colaboração
router.delete('/:id', CollaborationController.delete);

module.exports = router; 