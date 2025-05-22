const Collaboration = require('../models/Collaboration');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/collaborations';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limite de 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
}).array('files', 5); // máximo de 5 arquivos

class CollaborationController {
  // Criar nova colaboração
  static async create(req, res) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const collaborationData = {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          subject: req.body.subject,
          message: req.body.message
        };

        const files = req.files || [];
        const collaboration = await Collaboration.create(collaborationData, files);
        res.status(201).json(collaboration);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Listar todas as colaborações
  static async findAll(req, res) {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const collaborations = await Collaboration.findAll(filters);
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Buscar colaboração por ID
  static async findById(req, res) {
    try {
      const collaboration = await Collaboration.findById(req.params.id);
      if (!collaboration) {
        return res.status(404).json({ error: 'Colaboração não encontrada' });
      }
      res.json(collaboration);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!['pending', 'reviewed', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      const success = await Collaboration.updateStatus(req.params.id, status);
      if (!success) {
        return res.status(404).json({ error: 'Colaboração não encontrada' });
      }

      const collaboration = await Collaboration.findById(req.params.id);
      res.json(collaboration);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Deletar colaboração
  static async delete(req, res) {
    try {
      const success = await Collaboration.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Colaboração não encontrada' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CollaborationController; 