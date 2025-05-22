# Backend do Sistema Tucuju

## Visão Geral
O backend do Sistema Tucuju é uma aplicação Node.js que utiliza Express.js como framework web e MySQL como banco de dados. O sistema foi desenvolvido seguindo os princípios SOLID e utilizando uma arquitetura em camadas.

## Tecnologias Principais
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **MySQL**: Banco de dados relacional
- **Multer**: Middleware para upload de arquivos
- **CORS**: Middleware para permitir requisições cross-origin
- **TypeScript**: Para tipagem estática (opcional)

## Estrutura de Diretórios
```
backend/
├── src/
│   ├── config/         # Configurações do sistema
│   ├── controllers/    # Controladores da aplicação
│   ├── models/         # Modelos e lógica de negócios
├── database/           # Scripts SQL e migrations
├── routes/             # Rotas da API
├── server.js           # Ponto de entrada da aplicação
└── uploads/            # Diretório para arquivos enviados

## Arquitetura

### Padrão MVC (Model-View-Controller)
O sistema segue o padrão MVC, onde:
- **Models**: Responsáveis pela lógica de negócios e interação com o banco de dados
- **Controllers**: Gerenciam as requisições HTTP e coordenam a lógica de negócios
- **Routes**: Definem os endpoints da API

### Camadas da Aplicação
1. **Camada de Apresentação (Routes)**
   - Define os endpoints da API
   - Validação inicial das requisições
   - Roteamento para os controllers apropriados

2. **Camada de Controle (Controllers)**
   - Processa as requisições HTTP
   - Coordena a lógica de negócios
   - Gerencia respostas e erros

3. **Camada de Modelo (Models)**
   - Implementa a lógica de negócios
   - Interage com o banco de dados
   - Validações de dados

## Funcionalidades Implementadas

### 1. Gestão de Localidades
- CRUD completo de localidades
- Validação de dados
- Tratamento de erros
- Upload de imagens

### 2. Acervo Digital
- Upload de documentos
- Categorização de documentos
- Vinculação com localidades
- Busca e filtros
- Paginação

### 3. Indicadores
- Cadastro de indicadores
- Associação com localidades
- Histórico de valores

### 4. Cidades Gêmeas
- CRUD completo de duplas de cidades gêmeas
- Armazenamento de coordenadas geográficas
- Descrição da relação entre as cidades

## Padrões e Boas Práticas

### 1. Tratamento de Erros
- Middleware centralizado de erro
- Respostas padronizadas
- Logs de erro

### 2. Validação de Dados
- Validação de entrada em todas as requisições
- Sanitização de dados
- Mensagens de erro claras

### 3. Segurança
- CORS configurado
- Validação de tipos de arquivo
- Limite de tamanho de upload

### 4. Organização do Código
- Separação clara de responsabilidades
- Código modular e reutilizável
- Nomenclatura consistente

## API Endpoints

### Localidades
```
GET    /api/locations        # Lista todas as localidades
GET    /api/locations/:id    # Obtém uma localidade específica
POST   /api/locations        # Cria uma nova localidade
PUT    /api/locations/:id    # Atualiza uma localidade
DELETE /api/locations/:id    # Remove uma localidade
```

### Acervo Digital
```
GET    /api/digital-collection           # Lista documentos com paginação
GET    /api/digital-collection/:id       # Obtém um documento específico
POST   /api/digital-collection           # Cria um novo documento
PUT    /api/digital-collection/:id       # Atualiza um documento
DELETE /api/digital-collection/:id       # Remove um documento
GET    /api/digital-collection/location/:locationId  # Lista documentos por localidade
```

### Indicadores
```
GET    /api/indicators      # Lista todos os indicadores
GET    /api/indicators/:id  # Obtém um indicador específico
POST   /api/indicators      # Cria um novo indicador
PUT    /api/indicators/:id  # Atualiza um indicador
DELETE /api/indicators/:id  # Remove um indicador
```

### Cidades Gêmeas
```
GET    /api/twin-cities       # Lista todas as duplas de cidades gêmeas
GET    /api/twin-cities/:id   # Obtém uma dupla de cidades gêmeas específica
POST   /api/twin-cities       # Cria uma nova dupla de cidades gêmeas
PUT    /api/twin-cities/:id   # Atualiza uma dupla de cidades gêmeas
DELETE /api/twin-cities/:id   # Remove uma dupla de cidades gêmeas
```

## Banco de Dados

### Estrutura
- Tabelas relacionadas com chaves estrangeiras
- Índices para otimização de consultas
- Constraints para integridade referencial

### Principais Tabelas
- `locations`: Armazena informações das localidades
- `digital_collection`: Armazena documentos do acervo
- `indicators`: Armazena indicadores
- `document_tags`: Relacionamento entre documentos e tags
- `tags`: Armazena tags para categorização
- `twin_cities`: Armazena duplas de cidades gêmeas

## Configuração e Execução

### Requisitos
- Node.js 14+
- MySQL 8+
- NPM ou Yarn

### Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrations
npm run migrate
```

### Execução
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Próximos Passos
1. Implementar autenticação e autorização
2. Adicionar testes automatizados
3. Implementar cache
4. Melhorar documentação da API
5. Adicionar monitoramento e logs
6. Implementar backup automático
7. Otimizar consultas ao banco de dados 