const express = require('express');
const router = express.Router();
const IndicatorController = require('../src/controllers/IndicatorController');

// Listar todos os indicadores
router.get('/', IndicatorController.index);

// Buscar um indicador específico
router.get('/:id', IndicatorController.show);

// Criar novo indicador
router.post('/', IndicatorController.store);

// Atualizar indicador
router.put('/:id', IndicatorController.update);

// Excluir indicador
router.delete('/:id', IndicatorController.destroy);

module.exports = router; 