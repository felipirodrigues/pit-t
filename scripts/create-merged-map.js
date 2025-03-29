const mapshaper = require('mapshaper');
const path = require('path');
const fs = require('fs');

// Caminhos dos arquivos
const targetDir = path.join(__dirname, '../frontend/src/components/map');
const mapaGlobal = path.join(targetDir, 'Mapa.geojson');
const amapaDir = path.join(targetDir, 'Amapa');
const outputFile = path.join(targetDir, 'mapa-completo.geojson');

// Obter lista de arquivos GeoJSON dos municípios do Amapá
const amapaFiles = fs.readdirSync(amapaDir)
  .filter(file => file.endsWith('.json') || file.endsWith('.geojson'))
  .map(file => path.join(amapaDir, file));

// Montar o comando para mesclar os arquivos
const allFiles = [mapaGlobal, ...amapaFiles];
const inputFiles = allFiles.map(file => `"${file}"`).join(' ');
const command = `-i ${inputFiles} combine-files -merge-layers force -o "${outputFile}" format=geojson`;

console.log('Mesclando arquivos...');
console.log(`Arquivos a serem mesclados: ${allFiles.length}`);

// Executar o comando
mapshaper.runCommands(command, function(err) {
  if (err) {
    console.error('Erro ao processar o mapa:', err);
  } else {
    console.log('Mapa mesclado com sucesso!');
    console.log(`Arquivo de saída: ${outputFile}`);
  }
}); 