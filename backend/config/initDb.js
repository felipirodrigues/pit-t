const fs = require('fs');
const path = require('path');
const db = require('./db');

// Ler o arquivo SQL
const sqlFile = path.join(__dirname, 'database.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Query para criar a tabela de localidades
const createLocationsTable = `
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

// Query para criar a tabela de indicadores
const createIndicatorsTable = `
CREATE TABLE IF NOT EXISTS indicators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    unit VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
)`;

// Executar as queries em sequência
db.query(createLocationsTable, (err) => {
  if (err) {
    console.error('Erro ao criar tabela de localidades:', err);
    process.exit(1);
  }
  console.log('Tabela de localidades criada com sucesso!');

  db.query(createIndicatorsTable, (err) => {
    if (err) {
      console.error('Erro ao criar tabela de indicadores:', err);
      process.exit(1);
    }
    console.log('Tabela de indicadores criada com sucesso!');
    process.exit(0);
  });
}); 