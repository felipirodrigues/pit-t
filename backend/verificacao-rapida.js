#!/usr/bin/env node

/**
 * 🔍 VERIFICAÇÃO RÁPIDA - Campo Description
 * 
 * Script simples para verificar se tudo está funcionando
 * Uso: node verificacao-rapida.js
 */

const fs = require('fs');
const axios = require('axios');

// Configuração
const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';

console.log('🔍 VERIFICAÇÃO RÁPIDA - Campo Description PIT-T\n');

// 1. Verificar arquivos
console.log('📁 VERIFICANDO ARQUIVOS...');

const files = [
  'src/models/Indicator.js',                    // Relativo à pasta backend
  'src/controllers/IndicatorController.js',      // Relativo à pasta backend
  '../frontend/src/pages/LocationDetails.tsx'   // Relativo à pasta backend
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('description')) {
      console.log(`✅ ${file} - OK`);
    } else {
      console.log(`❌ ${file} - SEM description`);
    }
  } else {
    console.log(`❌ ${file} - NÃO EXISTE`);
  }
});

// 2. Testar API
console.log('\n🌐 TESTANDO API...');

async function testAPI() {
  try {
    // Testar se a API responde
    const response = await axios.get(`${API_BASE}/indicators`);
    console.log(`✅ API responde - ${response.data.length} indicadores`);
    
    // Verificar se algum tem description
    const withDesc = response.data.filter(ind => ind.description);
    console.log(`ℹ️ Indicadores com description: ${withDesc.length}`);
    
    // Testar criação
    const testData = {
      twin_city_id: 1,
      category: 'Saúde',
      title: 'Teste Rápido',
      description: 'Descrição de teste',
      source_title: 'Teste',
      city_a_value: 10,
      city_b_value: 20,
      unit: 'teste'
    };
    
    const create = await axios.post(`${API_BASE}/indicators`, testData);
    console.log(`✅ Criação OK - ID: ${create.data.id}`);
    
    // Verificar se description foi salva
    if (create.data.description === testData.description) {
      console.log('✅ Description salva corretamente!');
    } else {
      console.log('❌ Description NÃO foi salva!');
    }
    
    // Limpar
    await axios.delete(`${API_BASE}/indicators/${create.data.id}`);
    console.log('✅ Teste limpo');
    
  } catch (error) {
    console.log(`❌ Erro na API: ${error.message}`);
  }
}

testAPI();
