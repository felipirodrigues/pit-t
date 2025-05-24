# Backend do PIT-T

## Visão Geral
O backend do PIT-T é uma aplicação Node.js que utiliza Express.js como framework web e MySQL como banco de dados. O sistema foi desenvolvido seguindo os princípios SOLID e utilizando uma arquitetura em camadas (MVC), proporcionando alta escalabilidade, manutenibilidade e organização do código.

## Tecnologias Principais
- **Node.js**: Runtime JavaScript (v14+)
- **Express.js**: Framework web minimalista e flexível
- **MySQL**: Sistema de gerenciamento de banco de dados relacional
- **Multer**: Middleware para manipulação de upload de arquivos multipart/form-data
- **CORS**: Middleware para permitir requisições cross-origin
- **bcrypt**: Biblioteca para hash de senhas
- **jsonwebtoken**: Implementação de JSON Web Tokens para autenticação
- **dotenv**: Carregamento de variáveis de ambiente
- **axios**: Cliente HTTP para requisições externas

## Estrutura Detalhada de Diretórios

```
backend/
├── src/                              # Código fonte principal da aplicação
│   ├── app.js                       # Configuração principal do Express
│   ├── controllers/                  # Camada de controle (lógica de negócio)
│   │   ├── CollaborationController.js    # Gerencia colaborações entre cidades
│   │   ├── DigitalCollectionController.js # Gerencia acervo digital
│   │   ├── GalleryController.js         # Gerencia galeria de imagens
│   │   ├── IndicatorController.js       # Gerencia indicadores estatísticos
│   │   ├── LocationController.js        # Gerencia localidades/cidades
│   │   └── TwinCityController.js        # Gerencia cidades gêmeas
│   ├── models/                      # Camada de modelo (acesso a dados)
│   │   ├── Collaboration.js             # Modelo para colaborações
│   │   ├── DigitalCollection.js         # Modelo para documentos digitais
│   │   ├── Gallery.js                   # Modelo para galeria
│   │   ├── Indicator.js                 # Modelo para indicadores
│   │   ├── Location.js                  # Modelo para localidades
│   │   └── TwinCity.js                  # Modelo para cidades gêmeas
│   ├── middlewares/                 # Middlewares personalizados
│   │   ├── auth.js                      # Autenticação JWT
│   │   ├── documentUploadMiddleware.js  # Upload de documentos
│   │   ├── externalDocumentMiddleware.js # Documentos externos
│   │   └── uploadMiddleware.js          # Upload genérico
│   └── routes/                      # Definições de rotas (vazio - rotas na raiz)
├── routes/                          # Rotas da API REST
│   ├── index.js                     # Roteador principal
│   ├── locations.js                 # Endpoints para localidades
│   ├── indicators.js                # Endpoints para indicadores
│   ├── digitalCollection.js         # Endpoints para acervo digital
│   ├── collaboration.js             # Endpoints para colaborações
│   ├── gallery.js                   # Endpoints para galeria
│   ├── twinCities.js               # Endpoints para cidades gêmeas
│   └── users.js                    # Endpoints para usuários
├── config/                          # Configurações do sistema
│   ├── db.js                       # Configuração de conexão com MySQL
│   ├── initDb.js                   # Script de inicialização do banco
│   ├── database.sql                # Schema principal do banco
│   └── collaboration.sql           # Schema específico para colaborações
├── database/                        # Scripts e migrations do banco de dados
│   └── migrations/                  # Migrations ordenadas cronologicamente
│       ├── 001_create_tables.sql         # Criação das tabelas principais
│       ├── 002_create_twin_cities.sql    # Tabela de cidades gêmeas
│       ├── 003_update_indicators.sql     # Atualização dos indicadores
│       ├── 004_update_digital_collection.sql # Atualização do acervo
│       ├── 005_add_external_links_to_digital_collection.sql
│       ├── 006_make_twin_city_required.sql
│       ├── 007_allow_null_file_url.sql
│       ├── 008_create_collaborations.sql
│       ├── 009_create_users.sql          # Tabela de usuários
│       └── 010_add_role_to_users.sql     # Adição de roles aos usuários
├── middlewares/                     # Middlewares globais
│   └── auth.js                     # Middleware de autenticação global
├── uploads/                         # Diretório para arquivos enviados
├── server.js                        # Ponto de entrada da aplicação
├── package.json                     # Dependências e scripts NPM
├── test-api.html                   # Interface de teste da API
├── test-users-api.js              # Scripts de teste para API de usuários
└── README.md                       # Documentação do projeto
```

## Arquitetura do Sistema

### Padrão MVC (Model-View-Controller)
O sistema segue rigorosamente o padrão MVC:

#### **Models (Camada de Modelo)**
Localização: `src/models/`

Responsáveis pela lógica de negócios e interação direta com o banco de dados:

- **Location.js**: Gerencia operações CRUD para localidades/cidades
- **Indicator.js**: Gerencia indicadores estatísticos e seus valores históricos
- **DigitalCollection.js**: Gerencia documentos digitais, tags e categorização
- **Gallery.js**: Gerencia galeria de imagens e suas associações
- **TwinCity.js**: Gerencia relações entre cidades gêmeas
- **Collaboration.js**: Gerencia colaborações entre diferentes cidades

#### **Controllers (Camada de Controle)**
Localização: `src/controllers/`

Processam requisições HTTP e coordenam a lógica de negócios:

- **LocationController.js**: Operações CRUD para localidades
- **IndicatorController.js**: Gestão completa de indicadores
- **DigitalCollectionController.js**: Gestão do acervo digital com upload
- **GalleryController.js**: Gestão da galeria com processamento de imagens
- **TwinCityController.js**: Gestão de cidades gêmeas
- **CollaborationController.js**: Gestão de colaborações

#### **Routes (Camada de Apresentação)**
Localização: `routes/`

Definem endpoints da API e roteamento:

- **index.js**: Roteador principal que centraliza todas as rotas
- **locations.js**: Endpoints para `/api/locations`
- **indicators.js**: Endpoints para `/api/indicators`
- **digitalCollection.js**: Endpoints para `/api/digital-collection`
- **gallery.js**: Endpoints para `/api/gallery`
- **twinCities.js**: Endpoints para `/api/twin-cities`
- **collaboration.js**: Endpoints para `/api/collaborations`
- **users.js**: Endpoints para `/api/users`

### Fluxo de Requisição

1. **Entrada**: Requisição HTTP chega em `server.js`
2. **Roteamento**: `src/app.js` direciona para a rota apropriada em `routes/`
3. **Middleware**: Aplicação de middlewares (CORS, autenticação, validação)
4. **Controller**: Controller processa a requisição e chama o modelo
5. **Model**: Modelo executa operações no banco de dados
6. **Resposta**: Controller formata e retorna a resposta HTTP

## Funcionalidades Detalhadas

### 1. Sistema de Localidades
**Arquivos**: `LocationController.js`, `Location.js`, `locations.js`

- CRUD completo de cidades/localidades
- Validação de dados geográficos
- Associação com indicadores e acervo digital
- Suporte a coordenadas geográficas

### 2. Acervo Digital
**Arquivos**: `DigitalCollectionController.js`, `DigitalCollection.js`, `digitalCollection.js`

- Upload seguro de documentos (PDF, imagens, vídeos)
- Sistema de tags e categorização
- Busca avançada com filtros
- Paginação otimizada
- Suporte a documentos externos (links)
- Associação com localidades específicas

### 3. Sistema de Indicadores
**Arquivos**: `IndicatorController.js`, `Indicator.js`, `indicators.js`

- Cadastro de indicadores customizáveis
- Histórico temporal de valores
- Associação com localidades
- Cálculos estatísticos automáticos
- Validação de tipos de dados

### 4. Galeria de Imagens
**Arquivos**: `GalleryController.js`, `Gallery.js`, `gallery.js`

- Upload e processamento de imagens
- Thumbnails automáticos
- Organização por categorias
- Associação com eventos e localidades

### 5. Cidades Gêmeas
**Arquivos**: `TwinCityController.js`, `TwinCity.js`, `twinCities.js`

- Gestão de relações entre cidades
- Armazenamento de coordenadas geográficas
- Histórico de colaborações
- Descrição detalhada das relações

### 6. Sistema de Colaborações
**Arquivos**: `CollaborationController.js`, `Collaboration.js`, `collaboration.js`

- Registro de projetos colaborativos
- Acompanhamento de status
- Gestão de recursos compartilhados
- Histórico de atividades

### 7. Autenticação e Usuários
**Arquivos**: `users.js`, `auth.js`

- Registro e login de usuários
- Autenticação JWT
- Sistema de roles (admin, user)
- Hash seguro de senhas com bcrypt

## Middlewares do Sistema

### Middlewares Globais
- **CORS**: Permite requisições cross-origin
- **express.json()**: Parser de JSON
- **express.static()**: Servir arquivos estáticos de uploads

### Middlewares Personalizados

#### `src/middlewares/auth.js`
- Validação de tokens JWT
- Verificação de permissões
- Proteção de rotas sensíveis

#### `src/middlewares/uploadMiddleware.js`
- Configuração do Multer para uploads
- Validação de tipos de arquivo
- Limite de tamanho de arquivos

#### `src/middlewares/documentUploadMiddleware.js`
- Upload específico para documentos
- Validação de formatos aceitos (PDF, DOC, etc.)
- Organização automática em diretórios

#### `src/middlewares/externalDocumentMiddleware.js`
- Processamento de documentos externos
- Validação de URLs
- Download e cache local quando necessário

## Configuração do Banco de Dados

### Estrutura de Configuração

#### `config/db.js`
Configuração da conexão MySQL usando mysql2:
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

#### `config/initDb.js`
Script de inicialização que:
- Cria o banco de dados se não existir
- Executa todas as migrations em ordem
- Configura dados iniciais

### Sistema de Migrations
Localização: `database/migrations/`

As migrations são executadas em ordem numérica:

1. **001_create_tables.sql**: Estrutura básica (locations, indicators, digital_collection)
2. **002_create_twin_cities.sql**: Tabela de cidades gêmeas
3. **003_update_indicators.sql**: Melhorias na estrutura de indicadores
4. **004_update_digital_collection.sql**: Expansão do acervo digital
5. **005_add_external_links_to_digital_collection.sql**: Suporte a links externos
6. **006_make_twin_city_required.sql**: Ajustes de constraints
7. **007_allow_null_file_url.sql**: Flexibilização de URLs
8. **008_create_collaborations.sql**: Sistema de colaborações
9. **009_create_users.sql**: Sistema de usuários
10. **010_add_role_to_users.sql**: Sistema de permissões

## API Endpoints Detalhados

### Localidades (`/api/locations`)
```
GET    /api/locations        # Lista todas as localidades
GET    /api/locations/:id    # Obtém uma localidade específica
POST   /api/locations        # Cria uma nova localidade
PUT    /api/locations/:id    # Atualiza uma localidade
DELETE /api/locations/:id    # Remove uma localidade
```

### Indicadores (`/api/indicators`)
```
GET    /api/indicators          # Lista todos os indicadores
GET    /api/indicators/:id      # Obtém um indicador específico
POST   /api/indicators          # Cria um novo indicador
PUT    /api/indicators/:id      # Atualiza um indicador
DELETE /api/indicators/:id      # Remove um indicador
GET    /api/indicators/location/:locationId # Indicadores por localidade
```

### Acervo Digital (`/api/digital-collection`)
```
GET    /api/digital-collection           # Lista documentos com paginação
GET    /api/digital-collection/:id       # Obtém um documento específico
POST   /api/digital-collection           # Cria um novo documento
PUT    /api/digital-collection/:id       # Atualiza um documento
DELETE /api/digital-collection/:id       # Remove um documento
GET    /api/digital-collection/location/:locationId # Documentos por localidade
GET    /api/digital-collection/search    # Busca avançada
```

### Galeria (`/api/gallery`)
```
GET    /api/gallery         # Lista todas as imagens
GET    /api/gallery/:id     # Obtém uma imagem específica
POST   /api/gallery         # Upload de nova imagem
PUT    /api/gallery/:id     # Atualiza informações da imagem
DELETE /api/gallery/:id     # Remove uma imagem
```

### Cidades Gêmeas (`/api/twin-cities`)
```
GET    /api/twin-cities       # Lista todas as duplas de cidades gêmeas
GET    /api/twin-cities/:id   # Obtém uma dupla específica
POST   /api/twin-cities       # Cria uma nova dupla
PUT    /api/twin-cities/:id   # Atualiza uma dupla
DELETE /api/twin-cities/:id   # Remove uma dupla
```

### Colaborações (`/api/collaborations`)
```
GET    /api/collaborations      # Lista todas as colaborações
GET    /api/collaborations/:id  # Obtém uma colaboração específica
POST   /api/collaborations      # Cria uma nova colaboração
PUT    /api/collaborations/:id  # Atualiza uma colaboração
DELETE /api/collaborations/:id  # Remove uma colaboração
```

### Usuários (`/api/users`)
```
POST   /api/users/register     # Registro de novo usuário
POST   /api/users/login        # Login de usuário
GET    /api/users/profile      # Perfil do usuário autenticado
PUT    /api/users/profile      # Atualiza perfil
GET    /api/users              # Lista usuários (admin)
DELETE /api/users/:id          # Remove usuário (admin)
```

## Segurança Implementada

### Autenticação
- JWT (JSON Web Tokens) para sessões
- Hash de senhas com bcrypt
- Middleware de autenticação customizado

### Validação de Uploads
- Validação de tipos MIME
- Limite de tamanho de arquivos
- Sanitização de nomes de arquivos
- Verificação de extensões permitidas

### Proteção de Dados
- Validação de entrada em todas as requisições
- Sanitização de dados SQL
- Headers de segurança CORS configurados

## Configuração e Execução

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=tucuju
JWT_SECRET=seu_jwt_secret_super_seguro
```

### Instalação
```bash
# Instalar dependências
npm install

# Inicializar banco de dados
npm run init-db

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

### Scripts Disponíveis
- `npm start`: Executa o servidor em produção
- `npm run dev`: Executa com nodemon para desenvolvimento
- `npm run init-db`: Inicializa o banco de dados com migrations
- `npm test`: Placeholder para testes (a ser implementado)

## Arquivos de Teste

### `test-api.html`
Interface web para testar endpoints da API manualmente:
- Formulários para todas as operações CRUD
- Teste de upload de arquivos
- Visualização de respostas JSON

### `test-users-api.js`
Scripts automatizados para testar a API de usuários:
- Registro e login
- Validação de tokens
- Operações protegidas

## Tratamento de Erros

### Middleware Global de Erro
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});
```

### Padrões de Resposta
- **Sucesso**: Status 200/201 com dados
- **Erro de Validação**: Status 400 com detalhes
- **Não Autorizado**: Status 401
- **Não Encontrado**: Status 404
- **Erro Interno**: Status 500

## Próximos Passos e Melhorias

### Curto Prazo
1. Implementar testes automatizados (Jest)
2. Adicionar documentação Swagger/OpenAPI
3. Implementar rate limiting
4. Adicionar logs estruturados (Winston)

### Médio Prazo
1. Cache com Redis
2. Compressão de imagens automática
3. Backup automático do banco
4. Monitoramento de performance

### Longo Prazo
1. Migração para TypeScript
2. Implementação de microserviços
3. Sistema de notificações em tempo real
4. API GraphQL complementar

## Estrutura do Banco de Dados

### Principais Tabelas
- **locations**: Localidades e cidades
- **indicators**: Indicadores estatísticos
- **digital_collection**: Documentos do acervo
- **gallery**: Galeria de imagens
- **twin_cities**: Relações entre cidades gêmeas
- **collaborations**: Projetos colaborativos
- **users**: Usuários do sistema
- **tags**: Sistema de tags para categorização

### Relacionamentos
- Localidades podem ter múltiplos indicadores
- Documentos podem estar associados a localidades
- Cidades gêmeas formam pares bidirecionais
- Colaborações envolvem múltiplas localidades
- Usuários têm roles específicos

Este backend foi desenvolvido com foco em escalabilidade, manutenibilidade e facilidade de uso, seguindo as melhores práticas de desenvolvimento Node.js e arquitetura RESTful. 