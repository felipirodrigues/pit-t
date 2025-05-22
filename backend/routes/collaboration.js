const express = require('express');
const router = express.Router();
const CollaborationController = require('../src/controllers/CollaborationController');
const auth = require('../src/middlewares/auth');

// Rotas públicas
router.post('/', CollaborationController.create);
router.get('/:id', CollaborationController.findById);

// Rotas protegidas (requerem autenticação)
router.get('/', auth, CollaborationController.findAll);
router.patch('/:id/status', auth, CollaborationController.updateStatus);
router.delete('/:id', auth, CollaborationController.delete);

module.exports = router; 