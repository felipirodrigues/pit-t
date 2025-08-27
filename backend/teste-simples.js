#!/usr/bin/env node

/**
 * 🧪 TESTE SIMPLES - Identificar Problema
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

console.log('🧪 TESTE SIMPLES - PIT-T\n');

async function testeSimples() {
  try {
    // 1. Testar se a API responde
    console.log('1️⃣ Testando se a API responde...');
    const response = await axios.get(`${API_BASE}/indicators`);
    console.log('✅ API responde:', response.status);
    console.log('📊 Indicadores encontrados:', response.data.length);
    
    // 2. Testar criação SIMPLES (sem description primeiro)
    console.log('\n2️⃣ Testando criação SIMPLES...');
    const dadosSimples = {
      twin_city_id: 1,
      category: 'Saúde',
      title: 'Teste Simples',
      source_title: 'Teste',
      city_a_value: 10,
      city_b_value: 20,
      unit: 'teste'
    };
    
    console.log('📤 Dados enviados:', JSON.stringify(dadosSimples, null, 2));
    
    const createResponse = await axios.post(`${API_BASE}/indicators`, dadosSimples);
    console.log('✅ Criação simples OK:', createResponse.status);
    console.log('🆔 ID criado:', createResponse.data.id);
    
    // 3. Testar criação COM description
    console.log('\n3️⃣ Testando criação COM description...');
    const dadosComDescription = {
      ...dadosSimples,
      title: 'Teste com Description',
      description: 'Descrição de teste'
    };
    
    console.log('📤 Dados com description:', JSON.stringify(dadosComDescription, null, 2));
    
    const createDescResponse = await axios.post(`${API_BASE}/indicators`, dadosComDescription);
    console.log('✅ Criação com description OK:', createDescResponse.status);
    console.log('🆔 ID criado:', createDescResponse.data.id);
    console.log('📝 Description retornada:', createDescResponse.data.description);
    
    // 4. Limpar testes
    console.log('\n4️⃣ Limpando testes...');
    await axios.delete(`${API_BASE}/indicators/${createResponse.data.id}`);
    await axios.delete(`${API_BASE}/indicators/${createDescResponse.data.id}`);
    console.log('✅ Testes limpos!');
    
    console.log('\n🎉 TESTE SIMPLES CONCLUÍDO COM SUCESSO!');
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
      
      // Se for erro 500, mostrar mais detalhes
      if (error.response.status === 500) {
        console.error('\n🚨 ERRO 500 - Verificar logs do backend:');
        console.error('pm2 logs pitt-backend --lines 50');
      }
    }
  }
}

testeSimples();
