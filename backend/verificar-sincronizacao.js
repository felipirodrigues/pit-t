#!/usr/bin/env node

/**
 * 🔄 VERIFICAÇÃO DE SINCRONIZAÇÃO
 * 
 * Script para verificar se os arquivos estão sincronizados entre desenvolvimento e produção
 */

const fs = require('fs');

console.log('🔄 VERIFICAÇÃO DE SINCRONIZAÇÃO - PIT-T\n');

// Arquivos e verificações específicas
const verificacoes = [
  {
    arquivo: 'src/models/Indicator.js',
    buscar: 'description !== undefined ? description : null',
    nome: 'Correção do Model (Backend)'
  },
  {
    arquivo: 'src/controllers/IndicatorController.js',
    buscar: 'description: req.body.description',
    nome: 'Controller com Description (Backend)'
  },
  {
    arquivo: '../frontend/src/pages/LocationDetails.tsx',
    buscar: 'showTooltip',
    nome: 'Função showTooltip (Frontend)'
  },
  {
    arquivo: '../frontend/src/pages/LocationDetails.tsx',
    buscar: 'Saiba mais',
    nome: 'Botão "Saiba mais" (Frontend)'
  },
  {
    arquivo: '../frontend/src/pages/LocationDetails.tsx',
    buscar: 'tooltipData',
    nome: 'Estado do Tooltip (Frontend)'
  },
  {
    arquivo: '../frontend/src/pages/admin/Indicators.tsx',
    buscar: 'description',
    nome: 'Campo Description no Admin (Frontend)'
  }
];

console.log('📋 VERIFICANDO ARQUIVOS E FUNCIONALIDADES:\n');

let tudoOK = true;

verificacoes.forEach((verif, index) => {
  console.log(`${index + 1}. ${verif.nome}`);
  
  if (fs.existsSync(verif.arquivo)) {
    try {
      const content = fs.readFileSync(verif.arquivo, 'utf8');
      
      if (content.includes(verif.buscar)) {
        console.log(`   ✅ ENCONTRADO`);
      } else {
        console.log(`   ❌ NÃO ENCONTRADO`);
        tudoOK = false;
      }
    } catch (error) {
      console.log(`   ❌ ERRO: ${error.message}`);
      tudoOK = false;
    }
  } else {
    console.log(`   ❌ ARQUIVO NÃO EXISTE`);
    tudoOK = false;
  }
  console.log('');
});

// Verificação adicional: última modificação dos arquivos
console.log('📅 ÚLTIMA MODIFICAÇÃO DOS ARQUIVOS:\n');

const arquivosImportantes = [
  'src/models/Indicator.js',
  'src/controllers/IndicatorController.js',
  '../frontend/src/pages/LocationDetails.tsx'
];

arquivosImportantes.forEach(arquivo => {
  if (fs.existsSync(arquivo)) {
    const stats = fs.statSync(arquivo);
    console.log(`${arquivo}: ${stats.mtime.toISOString()}`);
  } else {
    console.log(`${arquivo}: NÃO EXISTE`);
  }
});

// Resultado final
console.log('\n' + '='.repeat(60));
if (tudoOK) {
  console.log('🎉 SINCRONIZAÇÃO OK - Todos os arquivos estão atualizados!');
  console.log('\n🔍 Se ainda não está funcionando, pode ser um problema de:');
  console.log('   1. Backend não foi reiniciado');
  console.log('   2. Frontend não foi rebuilded');
  console.log('   3. Cache do navegador');
} else {
  console.log('❌ SINCRONIZAÇÃO FALHOU - Arquivos não estão atualizados!');
  console.log('\n🔧 Ações necessárias:');
  console.log('   1. git pull origin main');
  console.log('   2. Verificar conflitos');
  console.log('   3. Resolver problemas de sync');
}
console.log('='.repeat(60));
