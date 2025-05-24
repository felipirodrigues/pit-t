# Frontend do PIT-T

## Visão Geral
O frontend do PIT-T é uma aplicação web moderna desenvolvida em React com TypeScript, utilizando Vite como bundler e uma arquitetura de componentes bem estruturada. O sistema oferece uma interface intuitiva e responsiva para exploração de dados geográficos, acervo digital e colaborações entre cidades gêmeas, com suporte completo à internacionalização.

## Tecnologias Principais
- **React 18.3**: Biblioteca JavaScript para interfaces de usuário
- **TypeScript 5.5**: Superset do JavaScript com tipagem estática
- **Vite 5.4**: Build tool e dev server ultra-rápido
- **React Router DOM 6.30**: Roteamento declarativo para React
- **Tailwind CSS 3.4**: Framework CSS utilitário para estilização
- **i18next**: Sistema completo de internacionalização
- **Axios**: Cliente HTTP para comunicação com APIs
- **Leaflet & React-Leaflet**: Mapas interativos
- **Cesium & Resium**: Visualização 3D de globo terrestre
- **React Globe.gl**: Visualização de globo 3D
- **Lucide React**: Conjunto de ícones SVG
- **JWT Decode**: Decodificação de tokens JWT

## Estrutura Detalhada de Diretórios

```
frontend/
├── src/                              # Código fonte principal da aplicação
│   ├── main.tsx                     # Ponto de entrada da aplicação React
│   ├── App.tsx                      # Componente raiz (placeholder)
│   ├── index.css                    # Estilos globais e Tailwind
│   ├── vite-env.d.ts               # Declarações de tipos do Vite
│   ├── pages/                       # Páginas da aplicação
│   │   ├── Home.tsx                     # Página inicial com mapa interativo
│   │   ├── LocationDetails.tsx          # Detalhes de localidades específicas
│   │   ├── AcervoDigital.tsx           # Página do acervo digital
│   │   ├── ColaboreConosco.tsx         # Página de colaboração
│   │   ├── Galleries.tsx               # Galeria de imagens
│   │   ├── Auth.tsx                     # Página de autenticação
│   │   ├── AccessDenied.tsx            # Página de acesso negado
│   │   └── admin/                      # Páginas administrativas
│   │       ├── Users.tsx                   # Gestão de usuários
│   │       ├── Indicators.tsx              # Gestão de indicadores
│   │       ├── Collection.tsx              # Gestão do acervo digital
│   │       ├── Gallery.tsx                 # Gestão de galerias
│   │       ├── GalleryItems.tsx           # Gestão de itens da galeria
│   │       ├── TwinCities.tsx             # Gestão de cidades gêmeas
│   │       └── Collaboration.tsx          # Gestão de colaborações
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── ProtectedRoute.tsx          # Componente de proteção de rotas
│   │   ├── LanguageSwitcher.tsx        # Seletor de idioma
│   │   └── layout/                     # Componentes de layout
│   │       ├── MainLayout.tsx              # Layout principal do site
│   │       ├── AdminLayout.tsx             # Layout da área administrativa
│   │       ├── Sidebar.tsx                 # Menu lateral principal
│   │       ├── RightSidebar.tsx           # Sidebar direita com informações
│   │       └── LanguageSwitcher.tsx       # Seletor de idioma específico
│   ├── contexts/                    # Contextos React (State Management)
│   │   └── AuthContext.tsx             # Contexto de autenticação global
│   ├── services/                    # Serviços de API e comunicação
│   │   └── api.ts                      # Configuração base do Axios
│   ├── routes/                      # Configuração de roteamento
│   │   └── index.tsx                   # Definição de todas as rotas
│   ├── types/                       # Definições de tipos TypeScript
│   │   ├── json.d.ts                   # Tipos para arquivos JSON
│   │   └── geojson.d.ts               # Tipos para dados GeoJSON
│   ├── i18n/                        # Sistema de internacionalização
│   │   ├── index.ts                    # Configuração do i18next
│   │   └── locales/                    # Arquivos de tradução
│   │       ├── pt-BR.ts                    # Português brasileiro
│   │       ├── en-US.ts                    # Inglês americano
│   │       └── fr-FR.ts                    # Francês
│   ├── images/                      # Recursos de imagem
│   └── mocks/                       # Dados fictícios para desenvolvimento
│       └── locations.json              # Dados mock de localidades
├── public/                          # Arquivos públicos estáticos
│   └── _redirects                   # Configuração de redirecionamentos
├── index.html                       # Template HTML principal
├── package.json                     # Dependências e scripts NPM
├── vite.config.ts                  # Configuração do Vite
├── tailwind.config.js              # Configuração do Tailwind CSS
├── postcss.config.js               # Configuração do PostCSS
├── tsconfig.json                   # Configuração principal do TypeScript
├── tsconfig.app.json               # Configuração específica da aplicação
├── tsconfig.node.json              # Configuração para scripts Node.js
├── eslint.config.js                # Configuração do ESLint
└── .gitignore                      # Arquivos ignorados pelo Git
```

## Arquitetura da Aplicação

### Padrão de Arquitetura: Component-Based + Context API

#### **Estrutura de Componentes**
- **Pages**: Componentes de página completa que representam rotas
- **Components**: Componentes reutilizáveis e blocos de construção
- **Layout**: Componentes que definem a estrutura visual das páginas
- **Context**: Gerenciamento de estado global usando React Context API

### Fluxo de Navegação

1. **Entrada**: `main.tsx` inicializa a aplicação React
2. **Roteamento**: `RouterProvider` com configuração em `routes/index.tsx`
3. **Layout**: `MainLayout` ou `AdminLayout` baseado na rota
4. **Autenticação**: `AuthContext` fornece estado global de autenticação
5. **Internacionalização**: `i18next` carrega traduções automaticamente
6. **Renderização**: Componente de página específico é renderizado

## Funcionalidades Detalhadas

### 1. Sistema de Autenticação
**Arquivos**: `AuthContext.tsx`, `Auth.tsx`, `ProtectedRoute.tsx`

#### Funcionalidades:
- **Login/Registro**: Interface completa de autenticação
- **JWT Management**: Armazenamento e validação de tokens
- **Proteção de Rotas**: Rotas administrativas protegidas por permissão
- **Controle de Acesso**: Sistema de roles (Aqui eu coloquei que todos os user cadastrados são "admin")
- **Persistência**: Manutenção de sessão entre recargas

#### Fluxo de Autenticação:
```typescript
// 1. Login do usuário
login(credentials) → API → JWT Token → AuthContext

// 2. Verificação de rotas protegidas
ProtectedRoute → AuthContext → permitir/negar acesso

// 3. Logout
logout() → limpar token → redirecionar para login
```

### 2. Interface Principal (Home)
**Arquivo**: `Home.tsx`

#### Funcionalidades:
- **Mapa Interativo**: Visualização de localidades em mapa 2D/3D
- **Globe 3D**: Representação tridimensional do planeta
- **Filtros Dinâmicos**: Busca e filtro de localidades
- **Visualização de Dados**: Indicadores e estatísticas
- **Navegação Intuitiva**: Acesso rápido a detalhes de localidades

### 3. Detalhes de Localidades (Essa eu retirei do ar, pois mudamos para cidades gêmeas)
**Arquivo**: `LocationDetails.tsx`

#### Funcionalidades:
- **Informações Completas**: Dados detalhados de cada localidade
- **Indicadores Visuais**: Gráficos e estatísticas
- **Acervo Associado**: Documentos e mídias relacionadas
- **Localização Geográfica**: Mapas e coordenadas
- **Colaborações**: Projetos e parcerias

### 4. Acervo Digital
**Arquivo**: `AcervoDigital.tsx`

#### Funcionalidades:
- **Navegação de Documentos**: Interface para explorar acervo
- **Sistema de Busca**: Busca avançada por categorias e tags
- **Filtros Múltiplos**: Por tipo, data, localidade, categoria
- **Visualização**: Preview de documentos e mídias
- **Download**: Acesso a arquivos originais

### 5. Sistema de Galerias
**Arquivos**: `Galleries.tsx`, `admin/Gallery.tsx`, `admin/GalleryItems.tsx`

#### Funcionalidades:
- **Visualização de Galerias**: Interface para navegar coleções de imagens
- **Upload de Imagens**: Sistema de upload para administradores
- **Organização**: Criação e gestão de galerias temáticas
- **Metadados**: Informações detalhadas sobre cada imagem

### 6. Colaborações
**Arquivos**: `ColaboreConosco.tsx`, `admin/Collaboration.tsx`

#### Funcionalidades:
- **Formulário de Contato**: Interface para propostas de colaboração
- **Gestão de Parcerias**: Painel administrativo para gerenciar colaborações
- **Status de Projetos**: Acompanhamento de projetos em andamento

### 7. Área Administrativa
**Arquivos**: Diretório `pages/admin/`

#### Módulos Administrativos:

##### **Gestão de Usuários** (`Users.tsx`)
- CRUD completo de usuários
- Controle de permissões e roles
- Histórico de atividades

##### **Gestão de Indicadores** (`Indicators.tsx`)
- Cadastro e edição de indicadores
- Associação com localidades
- Importação de dados históricos

##### **Gestão do Acervo** (`Collection.tsx`)
- Upload e categorização de documentos
- Sistema de tags e metadados
- Controle de visibilidade

##### **Gestão de Cidades Gêmeas** (`TwinCities.tsx`)
- Cadastro de relações entre cidades
- Coordenadas geográficas
- Descrições de parcerias

## Sistema de Internacionalização (i18n)

### Configuração: `src/i18n/`

#### Idiomas Suportados:
- **Português Brasileiro** (`pt-BR.ts`): Idioma padrão
- **Inglês Americano** (`en-US.ts`): Tradução completa
- **Francês** (`fr-FR.ts`): Tradução completa

#### Funcionalidades:
- **Detecção Automática**: Detecta idioma do navegador
- **Troca Dinâmica**: Mudança de idioma sem recarregamento
- **Fallback**: Volta para português em caso de tradução ausente
- **Contexto Completo**: Todas as interfaces traduzidas

#### Uso nos Componentes:
```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// Usar tradução
<h1>{t('homepage.title')}</h1>

// Trocar idioma
i18n.changeLanguage('en-US');
```

## Sistema de Roteamento

### Configuração: `src/routes/index.tsx`

#### Estrutura de Rotas:

##### **Rotas Públicas** (Layout Principal):
- `/` - Página inicial com mapa
- `/acervo` - Acervo digital
- `/colabore` - Formulário de colaboração
- `/galeria` - Galerias de imagens
- `/location/:id` - Detalhes de localidade
- `/acesso-negado` - Página de acesso negado

##### **Rota de Autenticação**:
- `/auth` - Login e registro

##### **Rotas Administrativas** (Protegidas):
- `/admin` - Dashboard principal (redireciona para twin-cities)
- `/admin/twin-cities` - Gestão de cidades gêmeas
- `/admin/indicators` - Gestão de indicadores
- `/admin/collection` - Gestão do acervo
- `/admin/gallery` - Gestão de galerias
- `/admin/gallery/:id/items` - Itens de galeria específica
- `/admin/users` - Gestão de usuários
- `/admin/collaboration` - Gestão de colaborações

### Proteção de Rotas:
```typescript
<ProtectedRoute adminOnly={true}>
  <AdminLayout />
</ProtectedRoute>
```

## Componentes de Layout

### 1. MainLayout (`components/layout/MainLayout.tsx`)
- Layout básico para páginas públicas
- Header com navegação principal
- Footer com informações do sistema

### 2. AdminLayout (`components/layout/AdminLayout.tsx`)
- Layout completo para área administrativa
- Sidebar com menu de navegação admin
- Header com informações do usuário
- Área de conteúdo principal

### 3. Sidebar (`components/layout/Sidebar.tsx`)
- Menu de navegação lateral
- Links contextuais baseados na página atual
- Indicadores visuais de página ativa

### 4. RightSidebar (`components/layout/RightSidebar.tsx`)
- Informações contextuais sobre localidades
- Dados dinâmicos baseados na seleção do usuário
- Links para páginas relacionadas

## Configurações e Tecnologias

### Vite Configuration (`vite.config.ts`)

#### Funcionalidades Configuradas:
- **Plugin React**: Suporte completo ao React + JSX
- **Cesium Integration**: Configuração específica para mapas 3D
- **Build Optimization**: Otimizações para produção
- **Source Maps**: Debug facilitado em desenvolvimento

#### Configurações Específicas:
```typescript
// Otimizações para Cesium
resolve: {
  alias: {
    'cesium': path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/Cesium.js'),
  }
}

// Build otimizado
build: {
  chunkSizeWarningLimit: 1500,
  sourcemap: true
}
```

### Tailwind CSS (`tailwind.config.js`)

#### Tema Personalizado:
- **Cores do Sistema**: Paleta específica do Tucuju
  - `forest-green`: #203820 (Verde floresta)
  - `dark-green`: #203820 (Verde escuro)
  - `system-bg`: #ffffff (Fundo do sistema)
  - `home-bg`: #132712 (Fundo da home)
- **Escala de Cinzas**: 9 tonalidades de cinza
- **Responsividade**: Breakpoints padrão do Tailwind

### TypeScript Configuration

#### `tsconfig.json` - Configuração Principal:
- **Target**: ES2020 para compatibilidade moderna
- **Module**: ESNext para tree-shaking otimizado
- **Strict Mode**: Validação rigorosa de tipos
- **JSX**: React-jsx para otimização

#### `tsconfig.app.json` - Configuração da Aplicação:
- **Include**: Todos os arquivos src/
- **Exclude**: node_modules e dist/

## Sistema de Estado (State Management)

### AuthContext (`src/contexts/AuthContext.tsx`)

#### Estado Global Gerenciado:
```typescript
interface AuthContextType {
  user: User | null;          // Dados do usuário logado
  token: string | null;       // Token JWT
  login: (credentials) => Promise<void>;
  logout: () => void;
  loading: boolean;           // Estado de carregamento
  isAdmin: boolean;           // Verificação de admin
}
```

#### Funcionalidades:
- **Persistência**: Token salvo no localStorage
- **Auto-logout**: Remoção automática de tokens expirados
- **Verificação de Permissões**: Controle de acesso baseado em roles

## Serviços e API

### API Configuration (`src/services/api.ts`)

#### Configuração do Axios:
```typescript
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Funcionalidades:
- **Base URL Configurável**: Via variáveis de ambiente
- **Token Automático**: Interceptor adiciona JWT automaticamente
- **Timeout**: Limite de 10 segundos para requisições
- **Error Handling**: Tratamento centralizado de erros

## Mapas e Visualização Geográfica

### Tecnologias Utilizadas:

#### 1. **Leaflet + React-Leaflet**
- **Mapas 2D**: Visualização tradicional de mapas
- **Markers Interativos**: Pontos de localidades clicáveis
- **Popups**: Informações rápidas sobre localidades
- **Controles**: Zoom, camadas, busca

#### 2. **Cesium + Resium**
- **Globe 3D**: Visualização tridimensional da Terra
- **Terrain**: Dados de elevação e relevo
- **Imagery**: Imagens de satélite em alta resolução
- **Performance**: Renderização otimizada WebGL

#### 3. **React Globe.gl**
- **Visualização Alternativa**: Globe simplificado
- **Animações**: Transições suaves entre localidades
- **Customização**: Cores e estilos personalizados

## Responsividade e Design

### Sistema de Design:
- **Mobile-First**: Design responsivo começando pelo mobile
- **Breakpoints**: Sistema padrão do Tailwind CSS
- **Componentes Adaptativos**: Layouts que se ajustam automaticamente
- **Touch-Friendly**: Interfaces otimizadas para toque

### Acessibilidade:
- **Semantic HTML**: Estrutura HTML semântica
- **ARIA Labels**: Atributos para screen readers
- **Contrast**: Cores com contraste adequado
- **Keyboard Navigation**: Navegação completa por teclado

## Scripts de Desenvolvimento

### Scripts Disponíveis (`package.json`):

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm start           # Alias para npm run dev

# Build e Deploy
npm run build       # Build de produção otimizado
npm run preview     # Preview do build de produção

# Qualidade de Código
npm run lint        # Executa ESLint para verificar código
```

### Variáveis de Ambiente:

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:3000/api
VITE_CESIUM_ION_TOKEN=seu_token_cesium_aqui
```

## Instalação e Execução

### Pré-requisitos:
- **Node.js**: Versão 18+ (recomendado)
- **NPM**: Versão 8+ ou Yarn
- **Navegador Moderno**: Chrome, Firefox, Safari, Edge

### Passos de Instalação:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# 3. Executar em desenvolvimento
npm run dev

# 4. Acessar aplicação
# http://localhost:5173
```

### Build para Produção:

```bash
# Build otimizado
npm run build

# Preview do build
npm run preview

# Deploy (arquivos em dist/)
# Copiar conteúdo de dist/ para servidor web
```

## Estrutura de Dados e Tipos

### Principais Interfaces TypeScript:

```typescript
// Localidade
interface Location {
  id: number;
  name: string;
  coordinates: [number, number];
  description: string;
  indicators: Indicator[];
}

// Indicador
interface Indicator {
  id: number;
  name: string;
  value: number;
  unit: string;
  category: string;
}

// Usuário
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
```

## Performance e Otimizações

### Otimizações Implementadas:

#### 1. **Code Splitting**
- **Lazy Loading**: Páginas carregadas sob demanda
- **Dynamic Imports**: Componentes grandes importados dinamicamente
- **Chunk Optimization**: Separação inteligente de código

#### 2. **Asset Optimization**
- **Tree Shaking**: Remoção de código não utilizado
- **Minification**: Compressão de JavaScript e CSS
- **Compression**: Gzip/Brotli para arquivos estáticos

#### 3. **Runtime Optimization**
- **React.memo**: Prevenção de re-renders desnecessários
- **useMemo/useCallback**: Memoização de cálculos caros
- **Virtual Scrolling**: Listas grandes renderizadas eficientemente

## Testes e Qualidade

### Ferramentas de Qualidade:
- **ESLint**: Análise estática de código
- **TypeScript**: Verificação de tipos em compile-time
- **Prettier**: Formatação consistente de código (a implementar)

### Futuras Implementações:
- **Jest**: Testes unitários
- **Testing Library**: Testes de componentes
- **Cypress**: Testes end-to-end
- **Storybook**: Documentação de componentes

## Próximos Passos e Roadmap

### Curto Prazo:
1. **Testes Automatizados**: Implementação de suíte de testes
2. **PWA**: Transformar em Progressive Web App
3. **Offline Support**: Funcionalidades offline básicas
4. **Performance Monitoring**: Métricas de performance real

### Médio Prazo:
1. **Storybook**: Documentação visual de componentes
2. **Design System**: Sistema de design unificado
3. **Dark Mode**: Tema escuro completo
4. **Advanced Maps**: Recursos avançados de mapeamento

### Longo Prazo:
1. **React Native**: Versão mobile nativa
2. **Real-time Features**: Atualizações em tempo real
3. **AI Integration**: Recursos de inteligência artificial
4. **Advanced Analytics**: Dashboard analítico avançado

## Arquitetura de Deployment

### Ambientes:
- **Development**: `npm run dev` (localhost:5173)
- **Staging**: Build com configurações de teste
- **Production**: Build otimizado para produção

### Compatibilidade:
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos**: Desktop, Tablet, Mobile
- **Sistemas**: Windows, macOS, Linux, iOS, Android

Este frontend foi desenvolvido com foco na experiência do usuário, performance e manutenibilidade, utilizando as mais modernas tecnologias e práticas de desenvolvimento React/TypeScript. 