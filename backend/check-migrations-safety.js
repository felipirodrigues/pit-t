const fs = require('fs');
const path = require('path');

// Função para verificar se uma migration é segura
const checkMigrationSafety = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Palavras-chave perigosas que podem apagar dados
    const dangerousKeywords = [
      'DROP TABLE',
      'TRUNCATE',
      'DELETE FROM',
      'DROP DATABASE',
      'DROP SCHEMA'
    ];
    
    const hasDangerousKeywords = dangerousKeywords.some(keyword => 
      content.toUpperCase().includes(keyword.toUpperCase())
    );
    
    if (hasDangerousKeywords) {
      console.log(`🚨 PERIGO: ${fileName} contém comandos perigosos!`);
      console.log(`   Arquivo: ${filePath}`);
      console.log(`   Comandos perigosos encontrados:`);
      
      dangerousKeywords.forEach(keyword => {
        if (content.toUpperCase().includes(keyword.toUpperCase())) {
          console.log(`   - ${keyword}`);
        }
      });
      
      return false;
    } else {
      console.log(`✅ SEGURO: ${fileName}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ ERRO ao ler ${filePath}: ${error.message}`);
    return false;
  }
};

// Verificar todas as migrations
const checkAllMigrations = () => {
  console.log('🔍 Verificando segurança das migrations...\n');
  
  const migrationsDir = path.join(__dirname, 'database', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('❌ Pasta de migrations não encontrada!');
    return;
  }
  
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  let allSafe = true;
  
  files.forEach(file => {
    const filePath = path.join(migrationsDir, file);
    const isSafe = checkMigrationSafety(filePath);
    if (!isSafe) allSafe = false;
  });
  
  console.log('\n' + '='.repeat(50));
  
  if (allSafe) {
    console.log('🎉 TODAS as migrations são seguras!');
    console.log('✅ Pode executar npm run init-db com segurança');
  } else {
    console.log('🚨 ATENÇÃO: Encontradas migrations perigosas!');
    console.log('❌ NÃO execute npm run init-db até resolver!');
    console.log('💡 Renomeie ou corrija as migrations perigosas');
  }
  
  console.log('='.repeat(50));
};

// Executar verificação
checkAllMigrations();
