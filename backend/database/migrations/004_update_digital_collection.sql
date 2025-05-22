-- Alterar a tabela digital_collection para relacionar com twin_cities
ALTER TABLE digital_collection DROP FOREIGN KEY digital_collection_ibfk_1;

-- Adicionar campo twin_city_id
ALTER TABLE digital_collection ADD COLUMN twin_city_id INT;

-- Adicionar foreign key para twin_cities
ALTER TABLE digital_collection ADD CONSTRAINT fk_twin_city 
FOREIGN KEY (twin_city_id) REFERENCES twin_cities(id) ON DELETE RESTRICT;

-- Remover o campo location_id após migrar os dados necessários
-- NOTA: Antes de executar esta parte, você deve migrar os dados manualmente
-- ALTER TABLE digital_collection DROP COLUMN location_id; 