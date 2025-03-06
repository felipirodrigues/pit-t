const db = require('../../config/db');

class Indicator {
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT i.*, l.name as location_name 
        FROM indicators i 
        JOIN locations l ON i.location_id = l.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT i.*, l.name as location_name 
        FROM indicators i 
        JOIN locations l ON i.location_id = l.id 
        WHERE i.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByLocationId(locationId) {
    try {
      const [rows] = await db.query(`
        SELECT i.*, l.name as location_name 
        FROM indicators i 
        JOIN locations l ON i.location_id = l.id 
        WHERE i.location_id = ?
      `, [locationId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(indicatorData) {
    try {
      const { location_id, title, value, unit } = indicatorData;
      const [result] = await db.query(
        'INSERT INTO indicators (location_id, title, value, unit) VALUES (?, ?, ?, ?)',
        [location_id, title, value, unit]
      );
      return { id: result.insertId, ...indicatorData };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, indicatorData) {
    try {
      const { location_id, title, value, unit } = indicatorData;
      await db.query(
        'UPDATE indicators SET location_id = ?, title = ?, value = ?, unit = ? WHERE id = ?',
        [location_id, title, value, unit, id]
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