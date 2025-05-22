-- Primeiro, remover a tabela existente de indicadores
DROP TABLE IF EXISTS indicators;

-- Criar tabela de indicadores atualizada
CREATE TABLE IF NOT EXISTS indicators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    twin_city_id INT NOT NULL,
    category ENUM('Saúde', 'População', 'Desenvolvimento', 'Educação', 'Meio Ambiente') NOT NULL,
    title VARCHAR(255) NOT NULL,
    study_date_start DATE,
    study_date_end DATE,
    source_title VARCHAR(255) NOT NULL,
    source_link TEXT,
    city_a_value DECIMAL(10, 2) NOT NULL,
    city_b_value DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (twin_city_id) REFERENCES twin_cities(id) ON DELETE CASCADE
); 