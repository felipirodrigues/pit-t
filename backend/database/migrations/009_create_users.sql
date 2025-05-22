-- Migração para criar a tabela de usuários
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir um usuário administrador padrão (senha: admin123)
-- A senha está como hash bcrypt e deve ser alterada após o primeiro login
INSERT INTO `users` (`name`, `email`, `password`) 
VALUES ('Administrador', 'admin@pitt.com', '$2b$10$Di7YuXi1hAW8/8RnUFDBcOmfce5YKz5NOXrUdbrPxsZ3RP8sRP816'); 