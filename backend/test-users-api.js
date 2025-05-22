const axios = require('axios');

// URL base da API
const API_URL = 'http://localhost:3000/api';
let authToken = '';
let createdUserId = null;

const testUsersAPI = async () => {
  try {
    console.log('==== TESTE DA API DE USUÁRIOS ====\n');
    
    // 1. Login para obter token
    console.log('1. Testando login...');
    const loginResponse = await axios.post(`${API_URL}/users/login`, {
      email: 'admin@pitt.com',
      password: 'admin123'
    });
    
    authToken = loginResponse.data.token;
    console.log('✅ Login bem-sucedido!');
    console.log(`ID do usuário: ${loginResponse.data.user.id}`);
    console.log(`Nome: ${loginResponse.data.user.name}`);
    console.log(`Email: ${loginResponse.data.user.email}`);
    console.log(`Token: ${authToken.substring(0, 15)}...\n`);
    
    // Configurar headers com o token de autenticação
    const headers = {
      'Authorization': `Bearer ${authToken}`
    };
    
    // 2. Listar todos os usuários
    console.log('2. Testando listagem de usuários...');
    const listResponse = await axios.get(`${API_URL}/users`, { headers });
    console.log(`✅ ${listResponse.data.length} usuários encontrados`);
    listResponse.data.forEach(user => {
      console.log(`- ${user.id}: ${user.name} (${user.email})`);
    });
    console.log();
    
    // 3. Criar um novo usuário
    console.log('3. Testando criação de usuário...');
    const newUser = {
      name: 'Usuário de Teste',
      email: `teste${Date.now()}@pitt.com`,
      password: 'senha123'
    };
    
    const createResponse = await axios.post(`${API_URL}/users`, newUser, { headers });
    createdUserId = createResponse.data.id;
    console.log(`✅ Usuário criado com sucesso! ID: ${createdUserId}`);
    console.log(`Nome: ${createResponse.data.name}`);
    console.log(`Email: ${createResponse.data.email}\n`);
    
    // 4. Obter um usuário pelo ID
    console.log(`4. Testando busca de usuário por ID (${createdUserId})...`);
    const getUserResponse = await axios.get(`${API_URL}/users/${createdUserId}`, { headers });
    console.log('✅ Usuário encontrado:');
    console.log(`ID: ${getUserResponse.data.id}`);
    console.log(`Nome: ${getUserResponse.data.name}`);
    console.log(`Email: ${getUserResponse.data.email}\n`);
    
    // 5. Atualizar um usuário
    console.log(`5. Testando atualização de usuário (ID: ${createdUserId})...`);
    const updateData = {
      name: 'Usuário Atualizado'
    };
    
    const updateResponse = await axios.put(`${API_URL}/users/${createdUserId}`, updateData, { headers });
    console.log('✅ Usuário atualizado com sucesso:');
    console.log(`ID: ${updateResponse.data.id}`);
    console.log(`Nome: ${updateResponse.data.name}`);
    console.log(`Email: ${updateResponse.data.email}\n`);
    
    // 6. Excluir um usuário
    console.log(`6. Testando exclusão de usuário (ID: ${createdUserId})...`);
    const deleteResponse = await axios.delete(`${API_URL}/users/${createdUserId}`, { headers });
    console.log(`✅ ${deleteResponse.data.message}\n`);
    
    // 7. Verificar usuário atual (me)
    console.log('7. Testando rota /auth/me...');
    const meResponse = await axios.get(`${API_URL}/users/auth/me`, { headers });
    console.log('✅ Dados do usuário autenticado:');
    console.log(`ID: ${meResponse.data.id}`);
    console.log(`Nome: ${meResponse.data.name}`);
    console.log(`Email: ${meResponse.data.email}\n`);
    
    console.log('==== TODOS OS TESTES FINALIZADOS COM SUCESSO! ====');
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Resposta:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

testUsersAPI(); 