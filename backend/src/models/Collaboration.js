const db = require('../database');

class Collaboration {
  static async create(collaboration) {
    const { name, email, phone, subject, message, files } = collaboration;
    
    try {
      const result = await db.query(
        `INSERT INTO collaborations (name, email, phone, subject, message, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id`,
        [name, email, phone, subject, message, 'pending']
      );

      const collaborationId = result.rows[0].id;

      // Se houver arquivos, insere na tabela de arquivos
      if (files && files.length > 0) {
        for (const file of files) {
          await db.query(
            `INSERT INTO collaboration_files (collaboration_id, file_name, file_path, file_size, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [collaborationId, file.originalname, file.path, file.size]
          );
        }
      }

      return collaborationId;
    } catch (error) {
      console.error('Erro ao criar colaboração:', error);
      throw error;
    }
  }

  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    try {
      const result = await db.query(
        `SELECT c.*, 
                array_agg(json_build_object(
                  'id', cf.id,
                  'file_name', cf.file_name,
                  'file_path', cf.file_path
                )) as files
         FROM collaborations c
         LEFT JOIN collaboration_files cf ON c.id = cf.collaboration_id
         GROUP BY c.id
         ORDER BY c.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const countResult = await db.query('SELECT COUNT(*) FROM collaborations');
      const total = parseInt(countResult.rows[0].count);

      return {
        collaborations: result.rows,
        total,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Erro ao buscar colaborações:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await db.query(
        `SELECT c.*, 
                array_agg(json_build_object(
                  'id', cf.id,
                  'file_name', cf.file_name,
                  'file_path', cf.file_path
                )) as files
         FROM collaborations c
         LEFT JOIN collaboration_files cf ON c.id = cf.collaboration_id
         WHERE c.id = $1
         GROUP BY c.id`,
        [id]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar colaboração:', error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const result = await db.query(
        `UPDATE collaborations
         SET status = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar status da colaboração:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Primeiro deleta os arquivos relacionados
      await db.query('DELETE FROM collaboration_files WHERE collaboration_id = $1', [id]);
      // Depois deleta a colaboração
      await db.query('DELETE FROM collaborations WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Erro ao deletar colaboração:', error);
      throw error;
    }
  }
}

module.exports = Collaboration; 