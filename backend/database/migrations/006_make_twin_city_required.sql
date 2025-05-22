-- Remover a obrigatoriedade de location_id e tornar twin_city_id obrigatório
ALTER TABLE digital_collection
    MODIFY COLUMN location_id int(11) NULL,
    MODIFY COLUMN twin_city_id int(11) NOT NULL;

-- Comentário explicativo
ALTER TABLE digital_collection COMMENT = 'Armazena documentos do acervo digital vinculados a cidades gêmeas';

-- Atualizar registros existentes que não tenham twin_city_id (caso exista algum)
-- Isso pode exigir ajustes dependendo do seu caso específico, como vincular a uma cidade gêmea padrão
UPDATE digital_collection SET twin_city_id = (SELECT id FROM twin_cities LIMIT 1) WHERE twin_city_id IS NULL; 