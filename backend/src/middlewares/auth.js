/**
 * Middleware de autenticação simplificado
 * 
 * ATENÇÃO: Este é um middleware de autenticação TEMPORÁRIO apenas para desenvolvimento
 * Em produção, você precisaria implementar uma autenticação real com JWT, sessões ou algo similar
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para prosseguir com a requisição
 */
const auth = (req, res, next) => {
  // Em uma aplicação real, você verificaria tokens, sessões, etc.
  // Por enquanto, apenas permitimos todas as requisições
  
  console.log('⚠️ AVISO: Usando middleware de autenticação temporário que permite todas as requisições');
  console.log('⚠️ AVISO: Esta é uma configuração INSEGURA, apenas para desenvolvimento');
  
  // Adiciona um objeto "user" falso à requisição para simular um usuário autenticado
  req.user = {
    id: 1,
    name: 'Admin',
    role: 'admin'
  };
  
  // Permite a requisição prosseguir
  next();
};

module.exports = auth; 