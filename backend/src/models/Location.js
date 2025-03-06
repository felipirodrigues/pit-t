const db = require('../../config/db');

class Location {
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM locations');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM locations WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(locationData) {
    try {
      const { name, description, latitude, longitude, country, image_url } = locationData;
      const [result] = await db.query(
        'INSERT INTO locations (name, description, latitude, longitude, country, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, latitude, longitude, country, image_url]
      );
      return { id: result.insertId, ...locationData };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, locationData) {
    try {
      const { name, description, latitude, longitude, country, image_url } = locationData;
      let query = 'UPDATE locations SET name = ?, description = ?, latitude = ?, longitude = ?, country = ?';
      let params = [name, description, latitude, longitude, country];

      if (image_url) {
        query += ', image_url = ?';
        params.push(image_url);
      }

      query += ' WHERE id = ?';
      params.push(id);

      await db.query(query, params);
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM locations WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Location; 