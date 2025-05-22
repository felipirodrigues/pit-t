const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middlewares/auth');

// Gerar token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'pitt-secret-key', {
    expiresIn: '1d' // Token expira em 1 dia
  });
};

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário pelo email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = users[0];

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = generateToken(user.id);

    // Retornar dados do usuário sem a senha
    const { password: _, ...userData } = user;

    return res.json({
      user: userData,
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar todos os usuários - requer autenticação
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, created_at, updated_at FROM users');
    return res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter um usuário pelo ID - requer autenticação
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [users] = await db.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?', 
      [id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    return res.json(users[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar um novo usuário - requer autenticação
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }
    
    // Verificar se o email já está em uso
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Este email já está em uso' });
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Inserir usuário
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    
    // Retornar o novo usuário sem a senha
    const [newUser] = await db.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    return res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar um usuário - requer autenticação
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    
    // Verificar se o usuário existe
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar se o email já está em uso por outro usuário
    if (email) {
      const [existingUsers] = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?', 
        [email, id]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Este email já está em uso por outro usuário' });
      }
    }
    
    // Preparar os campos que serão atualizados
    const updateFields = [];
    const values = [];
    
    if (name) {
      updateFields.push('name = ?');
      values.push(name);
    }
    
    if (email) {
      updateFields.push('email = ?');
      values.push(email);
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }
    
    // Adicionar o ID no final dos valores
    values.push(id);
    
    // Atualizar usuário
    await db.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    // Retornar o usuário atualizado sem a senha
    const [updatedUser] = await db.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    
    return res.json(updatedUser[0]);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir um usuário - requer autenticação
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário existe
    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar quantos usuários existem no sistema
    const [totalUsers] = await db.query('SELECT COUNT(*) as total FROM users');
    
    if (totalUsers[0].total <= 1) {
      return res.status(400).json({ 
        message: 'Não é possível excluir o último usuário administrador do sistema'
      });
    }
    
    // Excluir usuário
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    
    return res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Verificar token e retornar dados do usuário atual
router.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?', 
      [req.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    return res.json(users[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router; 