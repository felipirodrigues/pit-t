-- Adicionar coluna 'kind' para distinguir entre arquivos internos e links externos
ALTER TABLE digital_collection ADD COLUMN kind ENUM('internal', 'external') NOT NULL DEFAULT 'internal';

-- Adicionar coluna 'external_url' para armazenar URLs de documentos externos
ALTER TABLE digital_collection ADD COLUMN external_url TEXT NULL;

-- Atualizar comentários da tabela para documentação
ALTER TABLE digital_collection COMMENT = 'Armazena documentos do acervo digital, que podem ser uploads internos ou links externos'; 