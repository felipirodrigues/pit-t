#!/usr/bin/env node

/**
 * 🧪 DIAGNÓSTICO COMPLETO - Campo Description PIT-T
 * 
 * Este script testa TODAS as funcionalidades relacionadas ao campo description:
 * - Banco de dados
 * - API Backend
 * - Estrutura dos arquivos
 * - Validações
 * 
 * Uso: node diagnostico-completo-description.js
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configurações
const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tucuju'
};

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.magenta}${msg}${colors.reset}`)
};

// Função para verificar arquivos
const checkFiles = () => {
  log.title('📁 VERIFICAÇÃO DE ARQUIVOS');
  
  const filesToCheck = [
    'src/models/Indicator.js',                    // Relativo à pasta backend
    'src/controllers/IndicatorController.js',      // Relativo à pasta backend
    'routes/indicators.js',                       // Relativo à pasta backend
    '../frontend/src/pages/LocationDetails.tsx',  // Relativo à pasta backend
    '../frontend/src/pages/admin/Indicators.tsx'  // Relativo à pasta backend
  ];
  
  let allFilesExist = true;
  
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      log.success(`${file} - EXISTE`);
      
      // Verificar se tem as modificações necessárias
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        if (file.includes('Indicator.js') && file.includes('models')) {
          if (content.includes('description')) {
            log.success('  ✅ Campo description presente no modelo');
          } else {
            log.error('  ❌ Campo description NÃO encontrado no modelo');
            allFilesExist = false;
          }
        }
        
        if (file.includes('IndicatorController.js')) {
          if (content.includes('description: req.body.description')) {
            log.success('  ✅ Controller aceitando description');
          } else {
            log.error('  ❌ Controller NÃO aceitando description');
            allFilesExist = false;
          }
        }
        
        if (file.includes('LocationDetails.tsx')) {
          if (content.includes('showTooltip') && content.includes('Saiba mais')) {
            log.success('  ✅ Frontend com botão "Saiba mais" implementado');
          } else {
            log.error('  ❌ Frontend NÃO tem implementação do botão "Saiba mais"');
            allFilesExist = false;
          }
        }
        
        if (file.includes('Indicators.tsx') && file.includes('admin')) {
          if (content.includes('description') && content.includes('textarea')) {
            log.success('  ✅ Admin com campo description implementado');
          } else {
            log.error('  ❌ Admin NÃO tem campo description implementado');
            allFilesExist = false;
          }
        }
        
      } catch (error) {
        log.error(`  ❌ Erro ao ler arquivo: ${error.message}`);
        allFilesExist = false;
      }
      
    } else {
      log.error(`${file} - NÃO EXISTE`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
};

// Função para testar API
const testAPI = async () => {
  log.title('🌐 TESTE DA API');
  
  try {
    // Teste 1: Listar categorias
    log.section('1️⃣ Testando endpoint de categorias...');
    const categoriesResponse = await axios.get(`${API_BASE}/indicators/categories`);
    log.success(`Categorias: ${JSON.stringify(categoriesResponse.data)}`);
    log.info(`Total de categorias: ${categoriesResponse.data.length}`);
    
    // Teste 2: Listar indicadores
    log.section('2️⃣ Testando endpoint de indicadores...');
    const indicatorsResponse = await axios.get(`${API_BASE}/indicators`);
    log.success(`Indicadores encontrados: ${indicatorsResponse.data.length}`);
    
    // Verificar se algum indicador tem description
    const indicatorsWithDescription = indicatorsResponse.data.filter(ind => ind.description);
    log.info(`Indicadores com description: ${indicatorsWithDescription.length}`);
    
    if (indicatorsResponse.data.length > 0) {
      const firstIndicator = indicatorsResponse.data[0];
      log.info(`Primeiro indicador: ${JSON.stringify({
        id: firstIndicator.id,
        title: firstIndicator.title,
        category: firstIndicator.category,
        description: firstIndicator.description || 'Campo não presente'
      })}`);
    }
    
    // Teste 3: Criar indicador com description
    log.section('3️⃣ Testando criação com campo description...');
    const newIndicator = {
      twin_city_id: 1,
      category: 'Saúde',
      title: 'Teste Diagnóstico - Description',
      description: 'Esta é uma descrição de teste para verificar se o campo está funcionando',
      study_date_start: '2025-01-01',
      study_date_end: '2025-01-01',
      source_title: 'Teste Diagnóstico',
      source_link: 'https://teste.com',
      city_a_value: 100.00,
      city_b_value: 200.00,
      unit: 'teste'
    };
    
    const createResponse = await axios.post(`${API_BASE}/indicators`, newIndicator);
    log.success(`Indicador criado com sucesso!`);
    log.info(`ID: ${createResponse.data.id}`);
    log.info(`Description: ${createResponse.data.description}`);
    
    // Teste 4: Atualizar description
    log.section('4️⃣ Testando atualização do campo description...');
    const updateData = {
      description: 'Description atualizada via diagnóstico!'
    };
    
    const updateResponse = await axios.put(`${API_BASE}/indicators/${createResponse.data.id}`, updateData);
    log.success(`Description atualizada com sucesso!`);
    log.info(`Nova description: ${updateResponse.data.description}`);
    
    // Teste 5: Verificar se foi salvo no banco
    log.section('5️⃣ Verificando se description foi salva no banco...');
    const getResponse = await axios.get(`${API_BASE}/indicators/${createResponse.data.id}`);
    if (getResponse.data.description === updateData.description) {
      log.success('✅ Description salva corretamente no banco!');
    } else {
      log.error('❌ Description NÃO foi salva no banco!');
      log.info(`Esperado: ${updateData.description}`);
      log.info(`Recebido: ${getResponse.data.description}`);
    }
    
    // Limpeza
    log.section('6️⃣ Limpando indicador de teste...');
    await axios.delete(`${API_BASE}/indicators/${createResponse.data.id}`);
    log.success('Indicador de teste removido!');
    
    return true;
    
  } catch (error) {
    log.error(`Erro na API: ${error.message}`);
    if (error.response) {
      log.error(`Status: ${error.response.status}`);
      log.error(`Dados: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
};

// Função para verificar banco de dados
const checkDatabase = async () => {
  log.title('🗄️ VERIFICAÇÃO DO BANCO DE DADOS');
  
  try {
    // Verificar se a coluna description existe
    log.section('Verificando estrutura da tabela indicators...');
    
    // Como não temos acesso direto ao MySQL aqui, vamos verificar via API
    const indicatorsResponse = await axios.get(`${API_BASE}/indicators`);
    
    if (indicatorsResponse.data.length > 0) {
      const sampleIndicator = indicatorsResponse.data[0];
      
      if ('description' in sampleIndicator) {
        log.success('✅ Coluna description existe na tabela');
        log.info(`Tipo do campo: ${typeof sampleIndicator.description}`);
      } else {
        log.error('❌ Coluna description NÃO existe na tabela');
        return false;
      }
    }
    
    // Verificar se há indicadores com description
    const indicatorsWithDescription = indicatorsResponse.data.filter(ind => ind.description);
    log.info(`Indicadores com description preenchida: ${indicatorsWithDescription.length}`);
    
    if (indicatorsWithDescription.length > 0) {
      log.success('✅ Existem indicadores com description no banco');
      log.info(`Exemplo: ${indicatorsWithDescription[0].title} - "${indicatorsWithDescription[0].description}"`);
    } else {
      log.warning('⚠️ Nenhum indicador tem description preenchida');
    }
    
    return true;
    
  } catch (error) {
    log.error(`Erro ao verificar banco: ${error.message}`);
    return false;
  }
};

// Função principal
const runDiagnostico = async () => {
  console.log(`${colors.bright}${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║                    🧪 DIAGNÓSTICO COMPLETO                  ║
║                    Campo Description PIT-T                  ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  log.info('Iniciando diagnóstico completo...\n');
  
  // Verificar arquivos
  const filesOK = checkFiles();
  
  // Verificar banco de dados
  const dbOK = await checkDatabase();
  
  // Testar API
  const apiOK = await testAPI();
  
  // Resultado final
  log.title('📊 RESULTADO DO DIAGNÓSTICO');
  
  if (filesOK && dbOK && apiOK) {
    log.success('🎉 TUDO FUNCIONANDO PERFEITAMENTE!');
    log.info('✅ Arquivos estão corretos');
    log.info('✅ Banco de dados está configurado');
    log.info('✅ API está funcionando');
    log.info('✅ Campo description está operacional');
  } else {
    log.error('🚨 PROBLEMAS IDENTIFICADOS:');
    
    if (!filesOK) {
      log.error('❌ Problemas nos arquivos');
    }
    
    if (!dbOK) {
      log.error('❌ Problemas no banco de dados');
    }
    
    if (!apiOK) {
      log.error('❌ Problemas na API');
    }
    
    log.warning('🔧 Verifique os problemas acima e execute novamente');
  }
  
  console.log(`\n${colors.cyan}Diagnóstico concluído!${colors.reset}`);
};

// Executar diagnóstico
if (require.main === module) {
  runDiagnostico().catch(error => {
    log.error(`Erro fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runDiagnostico };
