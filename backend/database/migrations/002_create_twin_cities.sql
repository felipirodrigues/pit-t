-- Criar tabela de cidades gêmeas
CREATE TABLE IF NOT EXISTS twin_cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cityA_name VARCHAR(255) NOT NULL,
    cityA_latitude DECIMAL(10, 8) NOT NULL,
    cityA_longitude DECIMAL(11, 8) NOT NULL,
    cityB_name VARCHAR(255) NOT NULL,
    cityB_latitude DECIMAL(10, 8) NOT NULL,
    cityB_longitude DECIMAL(11, 8) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 