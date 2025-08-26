# Migration 011: Adicionar Campo Description aos Indicadores

## 📋 Descrição
Esta migration adiciona o campo `description` na tabela `indicators` para permitir descrições detalhadas dos indicadores estatísticos.

## 🗄️ Alterações no Banco

### Nova Coluna
- **Nome**: `description`
- **Tipo**: `TEXT`
- **Nullable**: `YES`
- **Comentário**: "Descrição detalhada do indicador"

### Atualização de Categorias
- Expande o ENUM de categorias para incluir mais opções
- Mantém compatibilidade com dados existentes

## 🚀 Como Executar

### Opção 1: Script Automático (Recomendado)
```bash
cd backend
npm run init-db
```

### Opção 2: Script Específico
```bash
cd backend
node run-migration-011.js
```

### Opção 3: Manual (MySQL)
```bash
mysql -u [usuario] -p [database] < database/migrations/011_add_description_to_indicators.sql
```

## ✅ Verificação

Após a execução, verifique se:

1. **Coluna criada**:
   ```sql
   DESCRIBE indicators;
   ```

2. **Estrutura atualizada**:
   ```sql
   SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT 
   FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = 'tucuju' AND TABLE_NAME = 'indicators';
   ```

## 🔄 Rollback (se necessário)

```sql
-- Remover coluna description
ALTER TABLE indicators DROP COLUMN description;

-- Reverter categorias (se necessário)
ALTER TABLE indicators 
MODIFY COLUMN category ENUM('Saúde', 'População', 'Desenvolvimento', 'Educação', 'Meio Ambiente') NOT NULL;
```

## 📝 Notas Técnicas

- **TEXT**: Permite descrições longas (até 65,535 caracteres)
- **NULL**: Campo opcional para não quebrar registros existentes
- **Compatibilidade**: Não afeta funcionalidades existentes
- **Performance**: Campo TEXT não é indexado por padrão

## 🎯 Próximos Passos

Após esta migration, será necessário:
1. Atualizar o backend (model, controller)
2. Atualizar o frontend (interface, formulário)
3. Implementar exibição da descrição

## 📞 Suporte

Em caso de problemas, verifique:
- Logs do MySQL
- Permissões do usuário do banco
- Estrutura atual da tabela indicators
