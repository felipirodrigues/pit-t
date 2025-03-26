const db = require('../../config/db');

class Gallery {
  static async create(galleryData) {
    const { name, location_id, type } = galleryData;
    const query = `
      INSERT INTO galleries (name, location_id, type, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    
    try {
      const [result] = await db.execute(query, [name, location_id, type]);
      return result.insertId;
    } catch (error) {
      throw new Error('Erro ao criar galeria: ' + error.message);
    }
  }

  static async findAll() {
    const query = `
      SELECT g.*, l.name as location_name 
      FROM galleries g 
      LEFT JOIN locations l ON g.location_id = l.id 
      ORDER BY g.created_at DESC
    `;
    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar galerias: ' + error.message);
    }
  }

  static async findById(id) {
    const query = `
      SELECT g.*, l.name as location_name 
      FROM galleries g 
      LEFT JOIN locations l ON g.location_id = l.id 
      WHERE g.id = ?
    `;
    try {
      const [rows] = await db.execute(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Erro ao buscar galeria: ' + error.message);
    }
  }

  static async update(id, galleryData) {
    const { name, location_id, type } = galleryData;
    const query = `
      UPDATE galleries 
      SET name = ?, location_id = ?, type = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    try {
      const [result] = await db.execute(query, [name, location_id, type, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Erro ao atualizar galeria: ' + error.message);
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM galleries WHERE id = ?';
    try {
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Erro ao deletar galeria: ' + error.message);
    }
  }

  // Métodos para gerenciar itens da galeria
  static async addItem(galleryId, itemData) {
    const { url, type } = itemData;
    const query = `
      INSERT INTO gallery_items (gallery_id, url, type, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    
    try {
      const [result] = await db.execute(query, [galleryId, url, type]);
      return result.insertId;
    } catch (error) {
      throw new Error('Erro ao adicionar item à galeria: ' + error.message);
    }
  }

  static async getItems(galleryId) {
    const query = 'SELECT * FROM gallery_items WHERE gallery_id = ? ORDER BY created_at DESC';
    try {
      const [rows] = await db.execute(query, [galleryId]);
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar itens da galeria: ' + error.message);
    }
  }

  static async getItemById(itemId) {
    const query = 'SELECT * FROM gallery_items WHERE id = ?';
    try {
      const [rows] = await db.execute(query, [itemId]);
      return rows[0];
    } catch (error) {
      throw new Error('Erro ao buscar item: ' + error.message);
    }
  }

  static async updateItem(itemId, itemData) {
    const { url, type } = itemData;
    const query = `
      UPDATE gallery_items 
      SET url = ?, type = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    try {
      const [result] = await db.execute(query, [url, type, itemId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Erro ao atualizar item: ' + error.message);
    }
  }

  static async deleteItem(itemId) {
    const query = 'DELETE FROM gallery_items WHERE id = ?';
    try {
      const [result] = await db.execute(query, [itemId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Erro ao deletar item da galeria: ' + error.message);
    }
  }

  static async checkLocationExists(locationId) {
    const query = 'SELECT id FROM locations WHERE id = ?';
    try {
      const [rows] = await db.execute(query, [locationId]);
      return rows.length > 0;
    } catch (error) {
      throw new Error('Erro ao verificar localidade: ' + error.message);
    }
  }
}

module.exports = Gallery; 