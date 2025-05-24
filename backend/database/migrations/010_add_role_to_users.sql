-- Migração para adicionar campo role à tabela de usuários
ALTER TABLE `users` ADD COLUMN `role` VARCHAR(50) DEFAULT 'admin' AFTER `password`;

-- Atualizar todos os usuários existentes para ter role admin
UPDATE `users` SET `role` = 'admin' WHERE `role` IS NULL OR `role` = ''; 