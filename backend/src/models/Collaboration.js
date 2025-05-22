const db = require('../../config/db');

class Collaboration {
  static async create(collaborationData, files = []) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Inserir colaboração
      const [result] = await conn.query(
        `INSERT INTO collaborations (
          name, email, phone, subject, message, status
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          collaborationData.name,
          collaborationData.email,
          collaborationData.phone || null,
          collaborationData.subject,
          collaborationData.message,
          'pending'
        ]
      );

      const collaborationId = result.insertId;

      // Inserir arquivos, se houver
      if (files.length > 0) {
        for (const file of files) {
          await conn.query(
            `INSERT INTO collaboration_files (
              collaboration_id, file_name, file_path, file_type, file_size
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              collaborationId,
              file.originalname,
              file.path,
              file.mimetype,
              file.size
            ]
          );
        }
      }

      await conn.commit();
      return this.findById(collaborationId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT c.*, 
          GROUP_CONCAT(
            JSON_OBJECT(
              'id', cf.id,
              'file_name', cf.file_name,
              'file_path', cf.file_path,
              'file_type', cf.file_type,
              'file_size', cf.file_size
            )
          ) as files
        FROM collaborations c
        LEFT JOIN collaboration_files cf ON c.id = cf.collaboration_id
        WHERE c.id = ?
        GROUP BY c.id
      `, [id]);

      if (rows.length === 0) return null;

      const collaboration = rows[0];
      return {
        ...collaboration,
        files: collaboration.files ? JSON.parse(`[${collaboration.files}]`) : []
      };
    } catch (error) {
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT c.*, 
          GROUP_CONCAT(
            JSON_OBJECT(
              'id', cf.id,
              'file_name', cf.file_name,
              'file_path', cf.file_path,
              'file_type', cf.file_type,
              'file_size', cf.file_size
            )
          ) as files
        FROM collaborations c
        LEFT JOIN collaboration_files cf ON c.id = cf.collaboration_id
      `;

      const whereConditions = [];
      const params = [];

      if (filters.status) {
        whereConditions.push('c.status = ?');
        params.push(filters.status);
      }

      if (filters.search) {
        whereConditions.push('(c.name LIKE ? OR c.email LIKE ? OR c.subject LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ');
      }

      query += ' GROUP BY c.id ORDER BY c.created_at DESC';

      // Adicionar paginação
      if (filters.page && filters.limit) {
        const offset = (filters.page - 1) * filters.limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(filters.limit), offset);
      }

      const [rows] = await db.query(query, params);

      // Processar resultados
      return rows.map(row => ({
        ...row,
        files: row.files ? JSON.parse(`[${row.files}]`) : []
      }));
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.query(
        'UPDATE collaborations SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM collaborations WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Collaboration; 