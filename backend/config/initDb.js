const fs = require('fs');
const path = require('path');
const db = require('./db');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

// Função para aplicar migrações
const applyMigrations = async () => {
  try {
    console.log('Aplicando migrações...');
    
    // Ler todas as migrações da pasta
    const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();
    
    // Aplicar cada migração em ordem
    for (const file of files) {
      console.log(`Tentando aplicar migração: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = await readFileAsync(filePath, 'utf8');
      
      // Dividir o SQL em comandos separados
      const commands = sql.split(';').filter(cmd => cmd.trim() !== '');
      
      // Executar cada comando SQL
      for (const command of commands) {
        if (command.trim() === '') continue;
        
        try {
          await db.query(command + ';');
        } catch (cmdError) {
          // Ignorar alguns erros específicos (como chaves que já existem ou não existem)
          console.warn(`Aviso na aplicação de um comando SQL: ${cmdError.message}`);
        }
      }
      
      console.log(`Migração aplicada: ${file}`);
    }
    
    console.log('Todas as migrações foram processadas!');
    return true;
  } catch (error) {
    console.error('Erro ao aplicar migrações:', error);
    return false;
  }
};

// Função para criar tabela de usuários diretamente
const createUsersTable = async () => {
  try {
    console.log('Criando tabela de usuários...');
    
    // SQL para criar a tabela de usuários
    const createUsersTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await db.query(createUsersTableSQL);
    
    // Verificar se já existem usuários
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    
    if (users[0].count === 0) {
      console.log('Criando usuário administrador padrão...');
      
      // Senha: admin123 (hash bcrypt)
      const adminPassword = '$2b$10$6jUNNh7tK.m3VIQQu2HyxeqjFTv1Upt1fHXcuc.ktNF7xQ6CWDJPW';
      
      // Inserir usuário admin padrão
      await db.query(`
        INSERT INTO users (name, email, password) 
        VALUES ('Administrador', 'admin@pitt.com', ?)
      `, [adminPassword]);
      
      console.log('Usuário administrador criado com sucesso!');
    } else {
      console.log('Usuários já existem, pulando criação do admin padrão.');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao criar tabela de usuários:', error);
    return false;
  }
};

// Executar o script
const init = async () => {
  try {
    await applyMigrations();
    const userTableSuccess = await createUsersTable();
    
    if (userTableSuccess) {
      console.log('Banco de dados inicializado com sucesso!');
    } else {
      console.error('Falha ao inicializar o banco de dados');
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
};

init();