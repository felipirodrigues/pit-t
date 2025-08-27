#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO COMPLETO - PIT-T
 * Script minucioso para identificar problemas de conexão
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

console.log('🔍 DIAGNÓSTICO COMPLETO - PIT-T\n');
console.log('=' .repeat(50));

// ========================================
// ETAPA 1: VERIFICAÇÃO DE ARQUIVOS
// ========================================
console.log('\n📁 ETAPA 1: VERIFICAÇÃO DE ARQUIVOS');
console.log('-'.repeat(30));

try {
  // Verificar se db.js existe
  const dbPath = path.join(__dirname, 'config', 'db.js');
  console.log('1️⃣ Verificando db.js...');
  if (fs.existsSync(dbPath)) {
    console.log('   ✅ db.js existe em:', dbPath);
    
    // Ler conteúdo do db.js
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    console.log('   📄 Conteúdo do db.js:');
    console.log('   ' + '='.repeat(40));
    console.log(dbContent);
    console.log('   ' + '='.repeat(40));
    
    // Verificar se contém IP incorreto
    if (dbContent.includes('200.131.235.119')) {
      console.log('   ❌ ENCONTRADO IP INCORRETO: 200.131.235.119');
    } else {
      console.log('   ✅ db.js NÃO contém IP incorreto');
    }
  } else {
    console.log('   ❌ db.js NÃO existe!');
  }
} catch (error) {
  console.log('   ❌ Erro ao verificar db.js:', error.message);
}

// Verificar outros arquivos de configuração
console.log('\n2️⃣ Verificando outros arquivos...');
const configFiles = [
  '.env',
  '.env.local',
  '.env.production',
  'config.js',
  'database.js'
];

configFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ⚠️  ${file} existe em: ${filePath}`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('200.131.235.119')) {
        console.log(`   ❌ ${file} contém IP incorreto!`);
      }
    } catch (error) {
      console.log(`   ❌ Erro ao ler ${file}:`, error.message);
    }
  }
});

// ========================================
// ETAPA 2: VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE
// ========================================
console.log('\n🌍 ETAPA 2: VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE');
console.log('-'.repeat(30));

console.log('1️⃣ Variáveis de ambiente relacionadas ao banco:');
const dbVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
dbVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`   ${varName}: ${value}`);
    if (value.includes('200.131.235.119')) {
      console.log(`   ❌ ${varName} contém IP incorreto!`);
    }
  } else {
    console.log(`   ${varName}: não definida`);
  }
});

console.log('\n2️⃣ Todas as variáveis de ambiente:');
Object.keys(process.env).forEach(key => {
  const value = process.env[key];
  if (value && value.includes('200.131.235.119')) {
    console.log(`   ❌ ${key}: ${value} (contém IP incorreto!)`);
  }
});

// ========================================
// ETAPA 3: VERIFICAÇÃO DE CONEXÃO MYSQL
// ========================================
console.log('\n🗄️  ETAPA 3: VERIFICAÇÃO DE CONEXÃO MYSQL');
console.log('-'.repeat(30));

console.log('1️⃣ Testando conexão direta com MySQL...');
const { exec } = require('child_process');

exec('mysql -u pit -p -h localhost -e "SELECT 1 as test"', (error, stdout, stderr) => {
  if (error) {
    console.log('   ❌ Erro na conexão direta MySQL:', error.message);
  } else {
    console.log('   ✅ Conexão direta MySQL OK');
    console.log('   📊 Resultado:', stdout.trim());
  }
});

// ========================================
// ETAPA 4: TESTE DE CONEXÃO VIA NODE.JS
// ========================================
console.log('\n🟢 ETAPA 4: TESTE DE CONEXÃO VIA NODE.JS');
console.log('-'.repeat(30));

async function testNodeConnection() {
  try {
    console.log('1️⃣ Importando configuração do db.js...');
    const db = require('./config/db.js');
    console.log('   ✅ db.js importado com sucesso');
    
    console.log('\n2️⃣ Testando conexão via Node.js...');
    const [rows] = await db.query('SELECT 1 as test');
    console.log('   ✅ Conexão via Node.js OK');
    console.log('   📊 Resultado:', rows[0]);
    
    console.log('\n3️⃣ Testando query mais complexa...');
    const [indicators] = await db.query('SELECT COUNT(*) as total FROM indicators');
    console.log('   ✅ Query complexa OK');
    console.log('   📊 Total de indicadores:', indicators[0].total);
    
  } catch (error) {
    console.log('   ❌ Erro na conexão via Node.js:', error.message);
    console.log('   📋 Stack trace:', error.stack);
    
    // Verificar se é erro de conexão
    if (error.code === 'ECONNREFUSED') {
      console.log('   🔍 ERRO DE CONEXÃO RECUSADA');
      console.log('   📍 Host tentado:', error.address);
      console.log('   🔌 Porta tentada:', error.port);
    }
  }
}

// ========================================
// ETAPA 5: VERIFICAÇÃO DE PROCESSOS
// ========================================
console.log('\n⚙️  ETAPA 5: VERIFICAÇÃO DE PROCESSOS');
console.log('-'.repeat(30));

console.log('1️⃣ Verificando processos MySQL...');
exec('ps aux | grep mysql', (error, stdout, stderr) => {
  if (stdout) {
    console.log('   📊 Processos MySQL:');
    stdout.split('\n').forEach(line => {
      if (line.includes('mysql') && !line.includes('grep')) {
        console.log('   ' + line.trim());
      }
    });
  }
});

console.log('\n2️⃣ Verificando porta 3306...');
exec('netstat -tlnp | grep 3306', (error, stdout, stderr) => {
  if (stdout) {
    console.log('   📊 Porta 3306 está ouvindo:');
    console.log('   ' + stdout.trim());
  } else {
    console.log('   ❌ Porta 3306 não está ouvindo');
  }
});

// ========================================
// ETAPA 6: VERIFICAÇÃO DE PERMISSÕES
// ========================================
console.log('\n🔐 ETAPA 6: VERIFICAÇÃO DE PERMISSÕES');
console.log('-'.repeat(30));

console.log('1️⃣ Verificando usuário atual...');
exec('whoami', (error, stdout, stderr) => {
  if (stdout) {
    console.log('   👤 Usuário atual:', stdout.trim());
  }
});

console.log('\n2️⃣ Verificando permissões do diretório...');
exec('ls -la', (error, stdout, stderr) => {
  if (stdout) {
    console.log('   📁 Permissões do diretório atual:');
    stdout.split('\n').slice(0, 5).forEach(line => {
      console.log('   ' + line);
    });
  }
});

// ========================================
// EXECUÇÃO DOS TESTES
// ========================================
console.log('\n🚀 INICIANDO TESTES...\n');

// Aguardar um pouco para os comandos assíncronos
setTimeout(() => {
  console.log('\n' + '='.repeat(50));
  console.log('🔍 EXECUTANDO TESTE DE CONEXÃO NODE.JS...');
  console.log('='.repeat(50));
  
  testNodeConnection().then(() => {
    console.log('\n' + '='.repeat(50));
    console.log('✅ DIAGNÓSTICO CONCLUÍDO!');
    console.log('='.repeat(50));
    console.log('\n📋 RESUMO:');
    console.log('1. Verifique os resultados acima');
    console.log('2. Procure por mensagens ❌');
    console.log('3. Identifique onde está o IP incorreto');
    console.log('4. Corrija o problema encontrado');
    
    process.exit(0);
  }).catch(error => {
    console.log('\n❌ ERRO NO DIAGNÓSTICO:', error.message);
    process.exit(1);
  });
}, 2000);
