const db = require('../../config/db');

class Indicator {
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT i.*, tc.cityA_name, tc.cityB_name
        FROM indicators i 
        JOIN twin_cities tc ON i.twin_city_id = tc.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT i.*, tc.cityA_name, tc.cityB_name
        FROM indicators i 
        JOIN twin_cities tc ON i.twin_city_id = tc.id 
        WHERE i.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByTwinCityId(twinCityId) {
    try {
      const [rows] = await db.query(`
        SELECT i.*, tc.cityA_name, tc.cityB_name
        FROM indicators i 
        JOIN twin_cities tc ON i.twin_city_id = tc.id 
        WHERE i.twin_city_id = ?
      `, [twinCityId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByCategory(category) {
    try {
      const [rows] = await db.query(`
        SELECT i.*, tc.cityA_name, tc.cityB_name
        FROM indicators i 
        JOIN twin_cities tc ON i.twin_city_id = tc.id 
        WHERE i.category = ?
      `, [category]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(indicatorData) {
    try {
      const { 
        twin_city_id, 
        category, 
        title, 
        study_date_start, 
        study_date_end, 
        source_title, 
        source_link, 
        city_a_value, 
        city_b_value, 
        unit, 
        icon 
      } = indicatorData;
      
      const [result] = await db.query(
        `INSERT INTO indicators (
          twin_city_id, 
          category, 
          title, 
          study_date_start, 
          study_date_end, 
          source_title, 
          source_link, 
          city_a_value, 
          city_b_value, 
          unit, 
          icon
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          twin_city_id, 
          category, 
          title, 
          study_date_start || null, 
          study_date_end || null, 
          source_title, 
          source_link || null, 
          city_a_value, 
          city_b_value, 
          unit, 
          icon || null
        ]
      );
      
      return { id: result.insertId, ...indicatorData };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, indicatorData) {
    try {
      const { 
        twin_city_id, 
        category, 
        title, 
        study_date_start, 
        study_date_end, 
        source_title, 
        source_link, 
        city_a_value, 
        city_b_value, 
        unit, 
        icon 
      } = indicatorData;
      
      await db.query(
        `UPDATE indicators SET 
          twin_city_id = ?, 
          category = ?, 
          title = ?, 
          study_date_start = ?, 
          study_date_end = ?, 
          source_title = ?, 
          source_link = ?, 
          city_a_value = ?, 
          city_b_value = ?, 
          unit = ?, 
          icon = ?
        WHERE id = ?`,
        [
          twin_city_id, 
          category, 
          title, 
          study_date_start || null, 
          study_date_end || null, 
          source_title, 
          source_link || null, 
          city_a_value, 
          city_b_value, 
          unit, 
          icon || null, 
          id
        ]
      );
      
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM indicators WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Indicator; 