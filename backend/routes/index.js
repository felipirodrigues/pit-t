const express = require('express');
const router = express.Router();

// Rota de exemplo
router.get('/', (req, res) => {
  res.send('Servidor Express está rodando!');
});

// Simulação de um banco de dados em memória
let users = [
  { id: 1, nome: 'Exemplo Nome', email: 'exemplo@email.com', telefone: '(99) 99999-9999', cidade: 'Exemplo Cidade', pais: 'Exemplo País' }
];

// Listar usuários
router.get('/users', (req, res) => {
  res.json(users);
});

// Adicionar usuário
router.post('/users', (req, res) => {
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Editar usuário
router.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { id: userId, ...req.body };
    res.json(users[userIndex]);
  } else {
    res.status(404).send('Usuário não encontrado');
  }
});

// Excluir usuário
router.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  users = users.filter(user => user.id !== userId);
  res.status(204).send();
});

module.exports = router; 