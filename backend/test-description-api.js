const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testDescriptionAPI() {
  try {
    console.log('🧪 Testando API de Indicadores com campo description...\n');
    
    // Teste 1: Listar categorias
    console.log('1️⃣ Testando endpoint de categorias...');
    const categoriesResponse = await axios.get(`${API_BASE}/indicators/categories`);
    console.log('✅ Categorias:', categoriesResponse.data);
    console.log('   Total de categorias:', categoriesResponse.data.length);
    console.log('');
    
    // Teste 2: Listar indicadores
    console.log('2️⃣ Testando endpoint de indicadores...');
    const indicatorsResponse = await axios.get(`${API_BASE}/indicators`);
    console.log('✅ Indicadores encontrados:', indicatorsResponse.data.length);
    
    if (indicatorsResponse.data.length > 0) {
      const firstIndicator = indicatorsResponse.data[0];
      console.log('   Primeiro indicador:', {
        id: firstIndicator.id,
        title: firstIndicator.title,
        category: firstIndicator.category,
        description: firstIndicator.description || 'Campo não presente'
      });
    }
    console.log('');
    
    // Teste 3: Criar indicador com description
    console.log('3️⃣ Testando criação com campo description...');
    const newIndicator = {
      twin_city_id: 1, // Assumindo que existe
      category: 'Educação',
      title: 'Teste - Taxa de Alfabetização',
      description: 'Este é um indicador de teste para verificar se o campo description está funcionando corretamente.',
      source_title: 'Instituto de Pesquisa',
      city_a_value: 85.5,
      city_b_value: 82.3,
      unit: '%'
    };
    
    try {
      const createResponse = await axios.post(`${API_BASE}/indicators`, newIndicator);
      console.log('✅ Indicador criado com sucesso!');
      console.log('   ID:', createResponse.data.id);
      console.log('   Description:', createResponse.data.description);
      
      // Teste 4: Atualizar description
      console.log('\n4️⃣ Testando atualização do campo description...');
      const updateData = {
        description: 'Description atualizada via teste da API!'
      };
      
      const updateResponse = await axios.put(`${API_BASE}/indicators/${createResponse.data.id}`, updateData);
      console.log('✅ Description atualizada com sucesso!');
      console.log('   Nova description:', updateResponse.data.description);
      
      // Limpar: deletar indicador de teste
      console.log('\n5️⃣ Limpando indicador de teste...');
      await axios.delete(`${API_BASE}/indicators/${createResponse.data.id}`);
      console.log('✅ Indicador de teste removido!');
      
    } catch (createError) {
      console.log('⚠️ Erro ao criar indicador:', createError.response?.data || createError.message);
      console.log('   Isso pode ser normal se não houver cidade gêmea com ID 1');
    }
    
    console.log('\n🎉 Teste da API concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Executar teste
testDescriptionAPI();
