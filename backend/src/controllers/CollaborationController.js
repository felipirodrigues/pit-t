const Collaboration = require('../models/Collaboration');

class CollaborationController {
  // Criar nova colaboração
  static async create(req, res) {
    try {
      const collaborationData = req.body;
      
      // Validação básica dos campos
      if (!collaborationData.nome_completo || !collaborationData.email || !collaborationData.assunto || !collaborationData.mensagem) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(collaborationData.email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }

      const id = await Collaboration.create(collaborationData);
      res.status(201).json({ 
        message: 'Colaboração criada com sucesso',
        id 
      });
    } catch (error) {
      console.error('Erro ao criar colaboração:', error);
      res.status(500).json({ error: 'Erro ao criar colaboração' });
    }
  }

  // Listar todas as colaborações
  static async list(req, res) {
    try {
      const collaborations = await Collaboration.findAll();
      res.json(collaborations);
    } catch (error) {
      console.error('Erro ao listar colaborações:', error);
      res.status(500).json({ error: 'Erro ao listar colaborações' });
    }
  }

  // Buscar colaboração por ID
  static async getById(req, res) {
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

  // Deletar colaboração
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Collaboration.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Colaboração não encontrada' });
      }
      
      res.json({ message: 'Colaboração deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar colaboração:', error);
      res.status(500).json({ error: 'Erro ao deletar colaboração' });
    }
  }
}

module.exports = CollaborationController; 