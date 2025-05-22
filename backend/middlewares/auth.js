const jwt = require('jsonwebtoken');

// Verificar se o usuário está autenticado através do token JWT
const authMiddleware = (req, res, next) => {
  // Obter o token do cabeçalho Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  // O formato esperado é "Bearer TOKEN"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Erro no formato do token' });
  }
  
  const [scheme, token] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }
  
  // Verificar se o token é válido
  jwt.verify(token, process.env.JWT_SECRET || 'pitt-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    // Adicionar o ID do usuário ao request para uso nas rotas
    req.userId = decoded.id;
    return next();
  });
};

module.exports = authMiddleware; 