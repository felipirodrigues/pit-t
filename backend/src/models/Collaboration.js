const db = require('../../config/db');

class Collaboration {
  static async create(collaborationData) {
    const { nome_completo, email, telefone, assunto, mensagem } = collaborationData;
    const query = `
      INSERT INTO colaboracoes (nome_completo, email, telefone, assunto, mensagem, data_criacao)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    
    try {
      const [result] = await db.execute(query, [nome_completo, email, telefone, assunto, mensagem]);
      return result.insertId;
    } catch (error) {
      throw new Error('Erro ao criar colaboração: ' + error.message);
    }
  }

  static async findAll() {
    const query = 'SELECT * FROM colaboracoes ORDER BY data_criacao DESC';
    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar colaborações: ' + error.message);
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM colaboracoes WHERE id = ?';
    try {
      const [rows] = await db.execute(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Erro ao buscar colaboração: ' + error.message);
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM colaboracoes WHERE id = ?';
    try {
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Erro ao deletar colaboração: ' + error.message);
    }
  }
}

module.exports = Collaboration; 