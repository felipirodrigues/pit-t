const express = require('express');
const router = express.Router();
const LocationController = require('../src/controllers/LocationController');
const upload = require('../src/middlewares/uploadMiddleware');

// Listar todas as localidades
router.get('/', LocationController.index);

// Buscar uma localidade específica
router.get('/:id', LocationController.show);

// Rota para criar uma nova localidade com imagem
router.post('/', upload.single('image'), LocationController.store);

// Rota para atualizar uma localidade com imagem
router.put('/:id', upload.single('image'), LocationController.update);

// Excluir localidade
router.delete('/:id', LocationController.destroy);

module.exports = router; 