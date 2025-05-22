const db = require('../../config/db');

class DigitalCollection {
  static async findAll(filters = {}) {
    try {
      console.log('=== Executando findAll no modelo ===');
      console.log('Filtros recebidos:', filters);

      // Construir a query base para contar o total
      let countQuery = `
        SELECT COUNT(DISTINCT dc.id) as total
        FROM digital_collection dc
        LEFT JOIN locations l ON dc.location_id = l.id
        LEFT JOIN twin_cities tc ON dc.twin_city_id = tc.id
        LEFT JOIN document_tags dt ON dc.id = dt.document_id
        LEFT JOIN tags t ON dt.tag_id = t.id
      `;

      // Construir a query principal
      let query = `
        SELECT 
          dc.id,
          dc.title,
          dc.author,
          dc.publication_year,
          dc.category,
          dc.file_url,
          dc.file_type,
          dc.file_size,
          dc.kind,
          dc.external_url,
          dc.location_id,
          dc.twin_city_id,
          dc.created_at,
          dc.updated_at,
          l.name as location_name,
          CONCAT(tc.cityA_name, ' - ', tc.cityB_name) as twin_city_name,
          GROUP_CONCAT(DISTINCT t.name) as tags
        FROM digital_collection dc
        LEFT JOIN locations l ON dc.location_id = l.id
        LEFT JOIN twin_cities tc ON dc.twin_city_id = tc.id
        LEFT JOIN document_tags dt ON dc.id = dt.document_id
        LEFT JOIN tags t ON dt.tag_id = t.id
      `;

      const whereConditions = [];
      const params = [];

      if (filters.category && filters.category !== '') {
        whereConditions.push('dc.category = ?');
        params.push(filters.category);
      }

      if (filters.location_id && filters.location_id !== '') {
        whereConditions.push('dc.location_id = ?');
        params.push(filters.location_id);
      }

      if (filters.twin_city_id && filters.twin_city_id !== '') {
        whereConditions.push('dc.twin_city_id = ?');
        params.push(filters.twin_city_id);
      }

      if (filters.search && filters.search !== '') {
        whereConditions.push('(dc.title LIKE ? OR dc.author LIKE ? OR t.name LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Adicionar WHERE conditions às queries
      if (whereConditions.length > 0) {
        const whereClause = ' WHERE ' + whereConditions.join(' AND ');
        countQuery += whereClause;
        query += whereClause;
      }

      // Adicionar GROUP BY à query principal
      query += ' GROUP BY dc.id, dc.title, dc.author, dc.publication_year, dc.category, dc.file_url, dc.file_type, dc.file_size, dc.kind, dc.external_url, dc.location_id, dc.twin_city_id, dc.created_at, dc.updated_at, l.name, twin_city_name';

      // Adicionar ORDER BY
      query += ' ORDER BY dc.created_at DESC';

      // Adicionar LIMIT e OFFSET para paginação
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const offset = (page - 1) * limit;

      query += ' LIMIT ? OFFSET ?';
      const queryParams = [...params, limit, offset];

      console.log('Query SQL para contagem:', countQuery);
      console.log('Parâmetros da contagem:', params);
      console.log('Query SQL principal:', query);
      console.log('Parâmetros da query principal:', queryParams);

      // Executar ambas as queries
      const [countRows] = await db.query(countQuery, params);
      const [rows] = await db.query(query, queryParams);

      console.log('Resultado da contagem:', countRows[0]);
      console.log('Número de registros retornados:', rows.length);
      if (rows.length > 0) {
        console.log('Exemplo do primeiro registro:', rows[0]);
      }

      // Processar os resultados
      const documents = rows.map(row => ({
        ...row,
        tags: row.tags ? row.tags.split(',') : []
      }));

      const result = {
        documents,
        total: countRows[0].total
      };

      console.log('Resultado final:', result);
      return result;
    } catch (error) {
      console.error('Erro no findAll:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT 
          dc.*, 
          l.name as location_name, 
          CONCAT(tc.cityA_name, ' - ', tc.cityB_name) as twin_city_name,
          GROUP_CONCAT(t.name) as tags
        FROM digital_collection dc
        LEFT JOIN locations l ON dc.location_id = l.id
        LEFT JOIN twin_cities tc ON dc.twin_city_id = tc.id
        LEFT JOIN document_tags dt ON dc.id = dt.document_id
        LEFT JOIN tags t ON dt.tag_id = t.id
        WHERE dc.id = ?
        GROUP BY dc.id
      `, [id]);

      if (rows.length === 0) return null;

      const document = rows[0];
      return {
        ...document,
        tags: document.tags ? document.tags.split(',') : []
      };
    } catch (error) {
      throw error;
    }
  }

  static async findByLocationId(locationId) {
    try {
      const [rows] = await db.query(`
        SELECT dc.*, l.name as location_name, GROUP_CONCAT(t.name) as tags
        FROM digital_collection dc
        JOIN locations l ON dc.location_id = l.id
        LEFT JOIN document_tags dt ON dc.id = dt.document_id
        LEFT JOIN tags t ON dt.tag_id = t.id
        WHERE dc.location_id = ?
        GROUP BY dc.id
      `, [locationId]);

      return rows.map(row => ({
        ...row,
        tags: row.tags ? row.tags.split(',') : []
      }));
    } catch (error) {
      throw error;
    }
  }

  static async findByTwinCityId(twinCityId) {
    try {
      const [rows] = await db.query(`
        SELECT 
          dc.*, 
          l.name as location_name, 
          CONCAT(tc.cityA_name, ' - ', tc.cityB_name) as twin_city_name,
          GROUP_CONCAT(t.name) as tags
        FROM digital_collection dc
        LEFT JOIN locations l ON dc.location_id = l.id
        LEFT JOIN twin_cities tc ON dc.twin_city_id = tc.id
        LEFT JOIN document_tags dt ON dc.id = dt.document_id
        LEFT JOIN tags t ON dt.tag_id = t.id
        WHERE dc.twin_city_id = ?
        GROUP BY dc.id
      `, [twinCityId]);

      return rows.map(row => ({
        ...row,
        tags: row.tags ? row.tags.split(',') : []
      }));
    } catch (error) {
      throw error;
    }
  }

  static async create(documentData, tags = []) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Verificar se a cidade gêmea existe
      if (documentData.twin_city_id) {
        const [twinCity] = await conn.query('SELECT id FROM twin_cities WHERE id = ?', [documentData.twin_city_id]);
        if (twinCity.length === 0) {
          throw new Error('Cidade gêmea não encontrada');
        }
      } else {
        throw new Error('É necessário fornecer twin_city_id');
      }

      // Inserir documento
      const [result] = await conn.query(
        `INSERT INTO digital_collection (
          title, author, publication_year, category, 
          file_url, file_type, file_size, 
          kind, external_url,
          twin_city_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          documentData.title,
          documentData.author,
          documentData.publication_year,
          documentData.category,
          documentData.kind === 'external' ? '' : (documentData.file_url || null),
          documentData.file_type || null,
          documentData.kind === 'external' ? 0 : (documentData.file_size || null),
          documentData.kind || 'internal',
          documentData.external_url || null,
          documentData.twin_city_id || null
        ]
      );

      const documentId = result.insertId;

      // Processar tags
      for (const tagName of tags) {
        // Inserir ou buscar tag existente
        const [existingTag] = await conn.query('SELECT id FROM tags WHERE name = ?', [tagName]);
        let tagId;

        if (existingTag.length > 0) {
          tagId = existingTag[0].id;
        } else {
          const [newTag] = await conn.query('INSERT INTO tags (name) VALUES (?)', [tagName]);
          tagId = newTag.insertId;
        }

        // Criar relação entre documento e tag
        await conn.query('INSERT INTO document_tags (document_id, tag_id) VALUES (?, ?)', [documentId, tagId]);
      }

      await conn.commit();
      return this.findById(documentId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async update(id, documentData, tags = []) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Verificar se a cidade gêmea existe
      if (documentData.twin_city_id) {
        const [twinCity] = await conn.query('SELECT id FROM twin_cities WHERE id = ?', [documentData.twin_city_id]);
        if (twinCity.length === 0) {
          throw new Error('Cidade gêmea não encontrada');
        }
      } else {
        throw new Error('É necessário fornecer twin_city_id');
      }

      // Atualizar documento
      await conn.query(
        `UPDATE digital_collection SET 
          title = ?, 
          author = ?, 
          publication_year = ?, 
          category = ?, 
          kind = ?,
          external_url = ?,
          twin_city_id = ? 
        WHERE id = ?`,
        [
          documentData.title,
          documentData.author,
          documentData.publication_year,
          documentData.category,
          documentData.kind || 'internal',
          documentData.external_url || null,
          documentData.twin_city_id || null,
          id
        ]
      );

      // Se houver um arquivo novo, atualize os detalhes do arquivo (apenas para documentos internos)
      if (documentData.file_url && documentData.kind === 'internal') {
        await conn.query(
          'UPDATE digital_collection SET file_url = ?, file_type = ?, file_size = ? WHERE id = ?',
          [
            documentData.file_url,
            documentData.file_type,
            documentData.file_size,
            id
          ]
        );
      }

      // Remover tags antigas
      await conn.query('DELETE FROM document_tags WHERE document_id = ?', [id]);

      // Processar novas tags
      for (const tagName of tags) {
        const [existingTag] = await conn.query('SELECT id FROM tags WHERE name = ?', [tagName]);
        let tagId;

        if (existingTag.length > 0) {
          tagId = existingTag[0].id;
        } else {
          const [newTag] = await conn.query('INSERT INTO tags (name) VALUES (?)', [tagName]);
          tagId = newTag.insertId;
        }

        await conn.query('INSERT INTO document_tags (document_id, tag_id) VALUES (?, ?)', [id, tagId]);
      }

      await conn.commit();
      return this.findById(id);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM digital_collection WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findTags() {
    try {
      const [rows] = await db.query('SELECT * FROM tags ORDER BY name');
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DigitalCollection; 