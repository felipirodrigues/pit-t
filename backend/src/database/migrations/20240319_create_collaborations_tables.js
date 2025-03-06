const { sql } = require('@vercel/postgres');

async function createCollaborationsTables() {
  try {
    // Tabela de colaborações
    await sql`
      CREATE TABLE IF NOT EXISTS collaborations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      );
    `;

    // Tabela de arquivos das colaborações
    await sql`
      CREATE TABLE IF NOT EXISTS collaboration_files (
        id SERIAL PRIMARY KEY,
        collaboration_id INTEGER REFERENCES collaborations(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_size INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    console.log('Tabelas de colaborações criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas de colaborações:', error);
    throw error;
  }
}

module.exports = createCollaborationsTables; 