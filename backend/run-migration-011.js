const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration011() {
  let connection;
  
  try {
    console.log('🚀 Iniciando Migration 011: Adicionar campo description aos indicadores...');
    
    // Conectar ao banco
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tucuju',
      multipleStatements: true
    });
    
    console.log('✅ Conectado ao banco de dados');
    
    // Ler o arquivo de migration
    const fs = require('fs');
    const migrationPath = './database/migrations/011_add_description_to_indicators.sql';
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Arquivo de migration não encontrado: ${migrationPath}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📖 Migration carregada com sucesso');
    
    // Executar a migration
    console.log('⚡ Executando migration...');
    await connection.execute(migrationSQL);
    
    console.log('✅ Migration executada com sucesso!');
    
    // Verificar se a coluna foi criada
    const [rows] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'indicators' AND COLUMN_NAME = 'description'
    `, [process.env.DB_NAME || 'tucuju']);
    
    if (rows.length > 0) {
      console.log('✅ Campo description criado com sucesso:');
      console.log(`   - Nome: ${rows[0].COLUMN_NAME}`);
      console.log(`   - Tipo: ${rows[0].DATA_TYPE}`);
      console.log(`   - Nullable: ${rows[0].IS_NULLABLE}`);
      console.log(`   - Comentário: ${rows[0].COLUMN_COMMENT}`);
    } else {
      console.log('⚠️ Campo description não foi encontrado após a migration');
    }
    
    // Verificar estrutura completa da tabela
    console.log('\n📋 Estrutura atualizada da tabela indicators:');
    const [tableStructure] = await connection.execute('DESCRIBE indicators');
    tableStructure.forEach(column => {
      console.log(`   - ${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro durante a migration:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão com banco fechada');
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runMigration011()
    .then(() => {
      console.log('🎉 Migration 011 concluída com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Falha na migration:', error);
      process.exit(1);
    });
}

module.exports = runMigration011;
