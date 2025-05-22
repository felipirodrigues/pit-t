const express = require('express');
const router = express.Router();
const TwinCityController = require('../src/controllers/TwinCityController');

// Listar todas as cidades gêmeas
router.get('/', TwinCityController.index);

// Buscar uma dupla de cidades gêmeas específica
router.get('/:id', TwinCityController.show);

// Criar uma nova dupla de cidades gêmeas
router.post('/', TwinCityController.store);

// Atualizar uma dupla de cidades gêmeas
router.put('/:id', TwinCityController.update);

// Excluir uma dupla de cidades gêmeas
router.delete('/:id', TwinCityController.destroy);

module.exports = router; 