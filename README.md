# PIT-T: Plataforma interativa de tipologias transfronteiriças

## Visão Geral
A PIT-T é uma plataforma web completa para facilitar a colaboração e intercâmbio de informações entre cidades gêmeas, com foco especial na região transfronteiriça Brasil-França (Amapá-Guiana Francesa).

## Arquitetura do Projeto
Este projeto está organizado em uma estrutura monorepo com dois módulos principais:

```
PIT-T/
├── backend/          # API REST em Node.js + Express + MySQL
├── frontend/         # Interface web em React + TypeScript + Vite
├── package.json      # Scripts de conveniência para desenvolvimento
└── README.md         # Este arquivo
```

## Funcionalidades Principais
- **🌍 Mapa Interativo**: Visualização 2D e 3D de localidades
- **📚 Acervo Digital**: Gestão de documentos e mídias
- **📊 Indicadores**: Sistema de métricas e estatísticas
- **🤝 Colaborações**: Plataforma para parcerias entre cidades
- **🖼️ Galerias**: Sistema de gestão de imagens
- **👥 Gestão de Usuários**: Autenticação e controle de acesso
- **🌐 Internacionalização**: Suporte a PT-BR, EN-US e FR-FR

## Tecnologias Utilizadas

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **Bcrypt** - Hash de senhas

### Frontend
- **React 18.3** - Biblioteca de interface
- **TypeScript 5.5** - Tipagem estática
- **Vite 5.4** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **i18next** - Internacionalização
- **Leaflet** - Mapas 2D
- **Cesium** - Globo 3D

## Início Rápido

### Pré-requisitos
- **Node.js** 18+ 
- **MySQL** 8+
- **NPM** ou **Yarn**

### Instalação

```bash
# 1. Clonar o repositório
git clone [url-do-repositorio]
cd PIT-T

# 2. Instalar dependências de ambos os projetos
npm run install:all

# 3. Configurar banco de dados (backend)
cd backend
cp .env.example .env
# Editar .env com suas configurações de banco
npm run init-db

# 4. Configurar frontend
cd ../frontend
cp .env.example .env
# Editar .env com configurações da API
```

### Desenvolvimento

```bash
# Executar backend e frontend simultaneamente
npm run dev

# Ou executar separadamente:
npm run dev:backend    # Backend em http://localhost:3000
npm run dev:frontend   # Frontend em http://localhost:5173
```

### Build para Produção

```bash
# Build de ambos os projetos
npm run build

# Ou builds separados:
npm run build:backend
npm run build:frontend
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Executa backend e frontend em desenvolvimento |
| `npm run dev:backend` | Executa apenas o backend |
| `npm run dev:frontend` | Executa apenas o frontend |
| `npm run build` | Build de produção (ambos) |
| `npm run build:backend` | Build do backend |
| `npm run build:frontend` | Build do frontend |
| `npm run install:all` | Instala dependências de ambos |
| `npm start` | Executa backend em produção |
| `npm test` | Executa testes (ambos) |

## Documentação Detalhada

### 📖 Backend
Documentação completa do backend: [backend/README.md](./backend/README.md)
- Arquitetura MVC
- API REST endpoints
- Configuração do banco de dados
- Sistema de autenticação
- Middlewares e validações

### 📖 Frontend  
Documentação completa do frontend: [frontend/README.md](./frontend/README.md)
- Arquitetura de componentes
- Sistema de roteamento
- Internacionalização
- Mapas e visualizações
- Interface administrativa

## Configuração de Ambiente

### Backend (.env)
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=tucuju
JWT_SECRET=seu_jwt_secret_super_seguro
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_CESIUM_ION_TOKEN=seu_token_cesium_aqui
```

## Deploy

### Backend
- Pode ser deployado em qualquer provedor que suporte Node.js
- Requer MySQL/MariaDB
- Configurar variáveis de ambiente
- Exemplo: Heroku, DigitalOcean, AWS EC2

### Frontend
- Build estático pode ser servido por qualquer CDN/hosting
- Exemplo: Netlify, Vercel, AWS S3 + CloudFront

## Contribuição

### Estrutura de Branches
- `main` - Código de produção
- `develop` - Código de desenvolvimento
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções de bugs

### Padrões de Código
- **Backend**: ESLint + Prettier
- **Frontend**: ESLint + TypeScript strict mode
- **Commits**: Conventional Commits

### Processo de Desenvolvimento
1. Fork do repositório
2. Criar branch feature/fix
3. Implementar mudanças
4. Testes locais
5. Pull Request para develop

## Roadmap

### 🚀 Próximas Versões
- [ ] Testes automatizados completos
- [ ] PWA (Progressive Web App)
- [ ] Sistema de notificações em tempo real
- [ ] API GraphQL complementar
- [ ] Dashboard analítico avançado
- [ ] Aplicativo mobile (React Native)

## Suporte e Licença

### 📞 Suporte
- **Issues**: Use o sistema de issues do GitHub
- **Documentação**: Consulte os READMEs específicos
- **Contato**: [seu-email@exemplo.com]

### 📄 Licença
Este projeto está licenciado sob a [MIT License](LICENSE).

## Equipe de Desenvolvimento
- **Desenvolvedor Principal**: [Seu Nome]
- **Instituição**: UNIFAP
- **Projeto**: PIT-T (Programa de Intercâmbio Tecnológico Transfronteiriço)

---

**PIT-T** - Conectando cidades, compartilhando conhecimento 🌍 