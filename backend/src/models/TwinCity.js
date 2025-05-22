const db = require('../../config/db');

class TwinCity {
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM twin_cities');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM twin_cities WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(twinCityData) {
    try {
      const { 
        cityA_name, 
        cityA_latitude, 
        cityA_longitude, 
        cityB_name, 
        cityB_latitude, 
        cityB_longitude, 
        description 
      } = twinCityData;
      
      const [result] = await db.query(
        `INSERT INTO twin_cities (
          cityA_name, 
          cityA_latitude, 
          cityA_longitude, 
          cityB_name, 
          cityB_latitude, 
          cityB_longitude, 
          description
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          cityA_name, 
          cityA_latitude, 
          cityA_longitude, 
          cityB_name, 
          cityB_latitude, 
          cityB_longitude, 
          description
        ]
      );
      
      return { id: result.insertId, ...twinCityData };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, twinCityData) {
    try {
      const { 
        cityA_name, 
        cityA_latitude, 
        cityA_longitude, 
        cityB_name, 
        cityB_latitude, 
        cityB_longitude, 
        description 
      } = twinCityData;
      
      await db.query(
        `UPDATE twin_cities SET 
          cityA_name = ?, 
          cityA_latitude = ?, 
          cityA_longitude = ?, 
          cityB_name = ?, 
          cityB_latitude = ?, 
          cityB_longitude = ?, 
          description = ?
        WHERE id = ?`,
        [
          cityA_name, 
          cityA_latitude, 
          cityA_longitude, 
          cityB_name, 
          cityB_latitude, 
          cityB_longitude, 
          description, 
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
      const [result] = await db.query('DELETE FROM twin_cities WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TwinCity; 