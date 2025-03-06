const Collaboration = require('../models/Collaboration');
const path = require('path');
const fs = require('fs').promises;

class CollaborationController {
  async store(req, res) {
    try {
      const { name, email, phone, subject, message } = req.body;
      const files = req.files;

      // Validação básica
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      const collaborationId = await Collaboration.create({
        name,
        email,
        phone,
        subject,
        message,
        files
      });

      res.status(201).json({ id: collaborationId, message: 'Colaboração criada com sucesso' });
    } catch (error) {
      console.error('Erro ao criar colaboração:', error);
      res.status(500).json({ error: 'Erro ao criar colaboração' });
    }
  }

  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await Collaboration.findAll(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Erro ao listar colaborações:', error);
      res.status(500).json({ error: 'Erro ao listar colaborações' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const collaboration = await Collaboration.findById(id);

      if (!collaboration) {
        return res.status(404).json({ error: 'Colaboração não encontrada' });
      }

      res.json(collaboration);
    } catch (error) {
      console.error('Erro ao buscar colaboração:', error);
      res.status(500).json({ error: 'Erro ao buscar colaboração' });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      const collaboration = await Collaboration.updateStatus(id, status);

      if (!collaboration) {
        return res.status(404).json({ error: 'Colaboração não encontrada' });
      }

      res.json(collaboration);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const collaboration = await Collaboration.findById(id);

      if (!collaboration) {
        return res.status(404).json({ error: 'Colaboração não encontrada' });
      }

      // Remove os arquivos físicos
      if (collaboration.files) {
        for (const file of collaboration.files) {
          if (file.file_path) {
            try {
              await fs.unlink(file.file_path);
            } catch (error) {
              console.error('Erro ao deletar arquivo:', error);
            }
          }
        }
      }

      await Collaboration.delete(id);
      res.json({ message: 'Colaboração deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar colaboração:', error);
      res.status(500).json({ error: 'Erro ao deletar colaboração' });
    }
  }

  async downloadFile(req, res) {
    try {
      const { id, fileId } = req.params;
      const collaboration = await Collaboration.findById(id);

      if (!collaboration) {
        return res.status(404).json({ error: 'Colaboração não encontrada' });
      }

      const file = collaboration.files.find(f => f.id === parseInt(fileId));
      if (!file) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      res.download(file.file_path, file.file_name);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      res.status(500).json({ error: 'Erro ao baixar arquivo' });
    }
  }
}

module.exports = new CollaborationController(); 