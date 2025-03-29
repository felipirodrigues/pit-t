const mapshaper = require('mapshaper');
const path = require('path');

// Caminhos dos arquivos
const inputFile = path.join(__dirname, '../frontend/src/components/map/Mapa.geojson');
const outputFile = path.join(__dirname, '../frontend/src/components/map/processed-map.geojson');

// Comando para processar o mapa
const command = `-i "${inputFile}" -filter 'ISO_A2 === "FR" && coordinates[0][0][0] > -55' -o "${outputFile}"`;

// Executar o comando
mapshaper.runCommands(command, function(err) {
  if (err) {
    console.error('Erro ao processar o mapa:', err);
  } else {
    console.log('Mapa processado com sucesso!');
  }
}); 