const Gallery = require('../models/Gallery');
const multer = require('multer');
const path = require('path');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/gallery')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'), false);
    }
  }
});

class GalleryController {
  // Criar nova galeria
  static async create(req, res) {
    try {
      const { name, location_id, type } = req.body;
      
      // Validações
      if (!name || !location_id || !type) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      if (!['photo', 'video'].includes(type)) {
        return res.status(400).json({ error: 'Tipo de galeria inválido' });
      }

      // Verificar se a localidade existe
      const locationExists = await Gallery.checkLocationExists(location_id);
      if (!locationExists) {
        return res.status(404).json({ error: 'Localidade não encontrada' });
      }

      const id = await Gallery.create({ name, location_id, type });
      res.status(201).json({ 
        message: 'Galeria criada com sucesso',
        id 
      });
    } catch (error) {
      console.error('Erro ao criar galeria:', error);
      res.status(500).json({ error: 'Erro ao criar galeria' });
    }
  }

  // Listar todas as galerias
  static async list(req, res) {
    try {
      const galleries = await Gallery.findAll();
      res.json(galleries);
    } catch (error) {
      console.error('Erro ao listar galerias:', error);
      res.status(500).json({ error: 'Erro ao listar galerias' });
    }
  }

  // Buscar galeria por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const gallery = await Gallery.findById(id);
      
      if (!gallery) {
        return res.status(404).json({ error: 'Galeria não encontrada' });
      }
      
      // Buscar itens da galeria
      const items = await Gallery.getItems(id);
      gallery.items = items;
      
      res.json(gallery);
    } catch (error) {
      console.error('Erro ao buscar galeria:', error);
      res.status(500).json({ error: 'Erro ao buscar galeria' });
    }
  }

  // Atualizar galeria
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, location_id, type } = req.body;

      // Validações
      if (!name || !location_id || !type) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      if (!['photo', 'video'].includes(type)) {
        return res.status(400).json({ error: 'Tipo de galeria inválido' });
      }

      // Verificar se a localidade existe
      const locationExists = await Gallery.checkLocationExists(location_id);
      if (!locationExists) {
        return res.status(404).json({ error: 'Localidade não encontrada' });
      }

      const updated = await Gallery.update(id, { name, location_id, type });
      if (!updated) {
        return res.status(404).json({ error: 'Galeria não encontrada' });
      }

      res.json({ message: 'Galeria atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar galeria:', error);
      res.status(500).json({ error: 'Erro ao atualizar galeria' });
    }
  }

  // Deletar galeria
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Gallery.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Galeria não encontrada' });
      }
      
      res.json({ message: 'Galeria deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar galeria:', error);
      res.status(500).json({ error: 'Erro ao deletar galeria' });
    }
  }

  // Listar itens de uma galeria
  static async listItems(req, res) {
    try {
      const { gallery_id } = req.params;
      const items = await Gallery.getItems(gallery_id);
      res.json(items);
    } catch (error) {
      console.error('Erro ao listar itens:', error);
      res.status(500).json({ error: 'Erro ao listar itens da galeria' });
    }
  }

  // Buscar item específico
  static async getItemById(req, res) {
    try {
      const { gallery_id, item_id } = req.params;
      const item = await Gallery.getItemById(item_id);
      
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }
      
      if (item.gallery_id !== parseInt(gallery_id)) {
        return res.status(400).json({ error: 'Item não pertence a esta galeria' });
      }
      
      res.json(item);
    } catch (error) {
      console.error('Erro ao buscar item:', error);
      res.status(500).json({ error: 'Erro ao buscar item' });
    }
  }

  // Adicionar item à galeria
  static async addItem(req, res) {
    try {
      const { gallery_id } = req.params;
      const { type, url } = req.body;

      // Validações
      if (!type || !['photo', 'video'].includes(type)) {
        return res.status(400).json({ error: 'Tipo de item inválido' });
      }

      if (type === 'photo' && !req.file) {
        return res.status(400).json({ error: 'Arquivo de imagem é obrigatório para itens do tipo foto' });
      }

      if (type === 'video' && !url) {
        return res.status(400).json({ error: 'URL é obrigatória para itens do tipo vídeo' });
      }

      const itemData = {
        url: type === 'photo' ? `/uploads/gallery/${req.file.filename}` : url,
        type
      };

      const id = await Gallery.addItem(gallery_id, itemData);
      res.status(201).json({ 
        message: 'Item adicionado com sucesso',
        id 
      });
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      res.status(500).json({ error: 'Erro ao adicionar item' });
    }
  }

  // Atualizar item da galeria
  static async updateItem(req, res) {
    try {
      const { gallery_id, item_id } = req.params;
      const { type, url } = req.body;

      // Validações
      if (!type || !['photo', 'video'].includes(type)) {
        return res.status(400).json({ error: 'Tipo de item inválido' });
      }

      if (type === 'photo' && !req.file) {
        return res.status(400).json({ error: 'Arquivo de imagem é obrigatório para itens do tipo foto' });
      }

      if (type === 'video' && !url) {
        return res.status(400).json({ error: 'URL é obrigatória para itens do tipo vídeo' });
      }

      const itemData = {
        url: type === 'photo' ? `/uploads/gallery/${req.file.filename}` : url,
        type
      };

      const updated = await Gallery.updateItem(item_id, itemData);
      if (!updated) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }

      res.json({ message: 'Item atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      res.status(500).json({ error: 'Erro ao atualizar item' });
    }
  }

  // Deletar item da galeria
  static async deleteItem(req, res) {
    try {
      const { gallery_id, item_id } = req.params;
      const deleted = await Gallery.deleteItem(item_id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }
      
      res.json({ message: 'Item deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      res.status(500).json({ error: 'Erro ao deletar item' });
    }
  }
}

module.exports = { GalleryController, upload }; 