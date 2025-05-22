// Middleware específico para documentos externos (sem upload de arquivo)
const externalDocumentMiddleware = (req, res, next) => {
  console.log('=== Middleware para documentos externos ===');
  console.log('Body recebido:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  
  // Definir explicitamente o tipo como 'external'
  req.body.kind = 'external';
  
  // Verificar se há uma URL externa
  if (!req.body.external_url) {
    console.log('Erro: URL externa não fornecida');
    return res.status(400).json({ error: 'Para documentos externos é necessário fornecer external_url' });
  }
  
  // Verificar se há cidade gêmea
  if (!req.body.twin_city_id) {
    console.log('Erro: ID da cidade gêmea não fornecido');
    return res.status(400).json({ error: 'É necessário fornecer twin_city_id' });
  }
  
  // Verificar campos obrigatórios
  const requiredFields = ['title', 'author', 'publication_year', 'category'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log('Campos obrigatórios ausentes:', missingFields);
    return res.status(400).json({ 
      error: 'Campos obrigatórios ausentes', 
      fields: missingFields 
    });
  }
  
  console.log('Documento externo válido, continuando...');
  console.log('Dados do documento:', req.body);
  next();
};

module.exports = externalDocumentMiddleware; 