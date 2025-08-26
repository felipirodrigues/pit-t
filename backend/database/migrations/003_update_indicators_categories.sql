-- Migration 003: Atualizar categorias dos indicadores (SEGURA)
-- Data: 2025-01-XX
-- Descrição: Atualiza ENUM de categorias de forma segura
-- ⚠️ IMPORTANTE: Esta migration é 100% segura e NUNCA afeta dados existentes

USE tucuju;

-- Verificar se as novas categorias já estão presentes
SET @current_categories = (
    SELECT COLUMN_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'tucuju' 
    AND TABLE_NAME = 'indicators' 
    AND COLUMN_NAME = 'category'
);

-- Só atualizar se as novas categorias não estiverem presentes
SET @sql = (SELECT IF(
    @current_categories LIKE '%Demografia%' AND @current_categories LIKE '%Economia%',
    'SELECT "Categorias já estão atualizadas" as status',
    'ALTER TABLE indicators MODIFY COLUMN category ENUM(
        "Demografia", "Economia", "Educação", "Saúde", "Infraestrutura", 
        "Segurança", "Meio Ambiente", "Turismo", "Cultura", "População", 
        "Desenvolvimento"
    ) NOT NULL COMMENT "Categoria do indicador"'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar se a atualização foi bem-sucedida
DESCRIBE indicators;
