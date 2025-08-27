#!/usr/bin/env node

/**
 * 🐛 DEBUG - Campo Description
 * 
 * Script para debugar exatamente o que está acontecendo com o campo description
 */

const axios = require('axios');

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';

console.log('🐛 DEBUG - Campo Description PIT-T\n');

async function debugDescription() {
  try {
    // 1. Verificar o que está sendo enviado
    console.log('📤 1. DADOS ENVIADOS:');
    const testData = {
      twin_city_id: 1,
      category: 'Saúde',
      title: 'DEBUG Description Test',
      description: 'Esta é uma descrição de teste para debug',
      source_title: 'Debug Test',
      city_a_value: 100,
      city_b_value: 200,
      unit: 'debug'
    };
    
    console.log('Payload enviado:', JSON.stringify(testData, null, 2));
    console.log('Campo description:', testData.description);
    console.log('Tipo do description:', typeof testData.description);
    console.log('Description é undefined?', testData.description === undefined);
    console.log('Description é null?', testData.description === null);
    console.log('Description é string vazia?', testData.description === '');
    
    // 2. Fazer a requisição
    console.log('\n📡 2. FAZENDO REQUISIÇÃO...');
    const createResponse = await axios.post(`${API_BASE}/indicators`, testData);
    
    // 3. Verificar o que foi retornado
    console.log('\n📥 3. RESPOSTA DA API:');
    console.log('Status:', createResponse.status);
    console.log('ID criado:', createResponse.data.id);
    console.log('Description retornada:', createResponse.data.description);
    console.log('Tipo do description retornado:', typeof createResponse.data.description);
    
    // 4. Verificar no banco
    console.log('\n🗄️ 4. VERIFICANDO NO BANCO...');
    const getResponse = await axios.get(`${API_BASE}/indicators/${createResponse.data.id}`);
    console.log('Description no banco:', getResponse.data.description);
    console.log('Tipo no banco:', typeof getResponse.data.description);
    
    // 5. Verificar se foi salvo corretamente
    console.log('\n✅ 5. VERIFICAÇÃO FINAL:');
    if (getResponse.data.description === testData.description) {
      console.log('🎉 SUCESSO: Description foi salva corretamente!');
    } else {
      console.log('❌ FALHA: Description NÃO foi salva corretamente!');
      console.log('Esperado:', testData.description);
      console.log('Recebido:', getResponse.data.description);
    }
    
    // 6. Limpar
    console.log('\n🧹 6. LIMPANDO...');
    await axios.delete(`${API_BASE}/indicators/${createResponse.data.id}`);
    console.log('Teste removido!');
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }
  }
}

debugDescription();
