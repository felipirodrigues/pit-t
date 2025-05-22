-- Criar tabela de colaborações
CREATE TABLE collaborations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL COMMENT 'Nome do colaborador',
    email VARCHAR(255) NOT NULL COMMENT 'Email do colaborador',
    phone VARCHAR(50) COMMENT 'Telefone do colaborador',
    subject VARCHAR(255) NOT NULL COMMENT 'Assunto da colaboração',
    message TEXT NOT NULL COMMENT 'Mensagem da colaboração',
    status ENUM('pending', 'reviewed', 'approved', 'rejected') DEFAULT 'pending' COMMENT 'Status da colaboração',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela para armazenar os arquivos anexados
CREATE TABLE collaboration_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    collaboration_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL COMMENT 'Nome original do arquivo',
    file_path VARCHAR(255) NOT NULL COMMENT 'Caminho do arquivo no servidor',
    file_type VARCHAR(50) NOT NULL COMMENT 'Tipo do arquivo',
    file_size INT NOT NULL COMMENT 'Tamanho do arquivo em bytes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collaboration_id) REFERENCES collaborations(id) ON DELETE CASCADE
); 