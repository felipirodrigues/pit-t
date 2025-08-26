-- Migration 011: Adicionar campo description na tabela indicators
-- Data: 2025-01-XX
-- Descrição: Adiciona campo description para permitir descrições detalhadas dos indicadores
-- ⚠️ IMPORTANTE: Esta migration é 100% segura e NUNCA afeta dados existentes

USE tucuju;

-- Verificar se a coluna description já existe (evita erro se executar duas vezes)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'tucuju' 
     AND TABLE_NAME = 'indicators' 
     AND COLUMN_NAME = 'description') > 0,
    'SELECT "Coluna description já existe" as status',
    'ALTER TABLE indicators ADD COLUMN description TEXT NULL COMMENT "Descrição detalhada do indicador"'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migration 011 focada apenas no campo description
-- As categorias são tratadas na migration 003_update_indicators_categories.sql

-- Verificar se a coluna foi criada
DESCRIBE indicators;

-- Mostrar estrutura atualizada da tabela
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'tucuju' AND TABLE_NAME = 'indicators'
ORDER BY ORDINAL_POSITION;

-- Verificar quantos registros existem (para confirmar que não foram perdidos)
SELECT COUNT(*) as total_indicators FROM indicators;
