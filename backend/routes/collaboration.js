const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CollaborationController = require('../src/controllers/CollaborationController');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/collaborations')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // máximo de 5 arquivos
  }
});

// Rotas
router.post('/', upload.array('files', 5), CollaborationController.store);
router.get('/', CollaborationController.index);
router.get('/:id', CollaborationController.show);
router.put('/:id/status', CollaborationController.updateStatus);
router.delete('/:id', CollaborationController.destroy);
router.get('/:id/files/:fileId', CollaborationController.downloadFile);

module.exports = router; 