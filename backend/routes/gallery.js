const express = require('express');
const router = express.Router();
const { GalleryController, upload } = require('../src/controllers/GalleryController');

// Rotas para galerias
router.post('/', GalleryController.create);
router.get('/', GalleryController.list);
router.get('/:id', GalleryController.getById);
router.put('/:id', GalleryController.update);
router.delete('/:id', GalleryController.delete);

// Rotas para itens da galeria
router.get('/:gallery_id/items', GalleryController.listItems);
router.get('/:gallery_id/items/:item_id', GalleryController.getItemById);
router.post('/:gallery_id/items', upload.single('image'), GalleryController.addItem);
router.put('/:gallery_id/items/:item_id', upload.single('image'), GalleryController.updateItem);
router.delete('/:gallery_id/items/:item_id', GalleryController.deleteItem);

module.exports = router; 