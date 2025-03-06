const mysql = require('mysql2/promise');

// Configuração do banco de dados
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123mudar',
  database: process.env.DB_NAME || 'pit_t',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db; 