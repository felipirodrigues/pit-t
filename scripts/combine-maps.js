const mapshaper = require('mapshaper');
const path = require('path');

// Caminhos dos arquivos
const originalMap = path.join(__dirname, '../frontend/src/components/map/Mapa.geojson');
const guianaFrancesa = path.join(__dirname, '../frontend/src/components/map/processed-map.geojson');
const france = path.join(__dirname, '../frontend/src/components/map/france.geojson');
const outputFile = path.join(__dirname, '../frontend/src/components/map/final-map.geojson');

// Comando para combinar os mapas
const command = `-i "${originalMap}" "${guianaFrancesa}" "${france}" -merge-layers -o "${outputFile}"`;

// Executar o comando
mapshaper.runCommands(command, function(err) {
  if (err) {
    console.error('Erro ao combinar os mapas:', err);
  } else {
    console.log('Mapas combinados com sucesso!');
  }
}); 