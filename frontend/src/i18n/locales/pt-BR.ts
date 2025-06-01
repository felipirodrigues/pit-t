export default {
  translation: {
    languageSelector: 'Selecione o idioma',
    twinCities: 'Cidades Gêmeas',
    noTwinCitiesFound: 'Nenhuma cidade gêmea encontrada',
    menu: {
      home: 'Início',
      digitalCollection: 'Acervo Digital',
      collaborate: 'Colabore Conosco',
      gallery: 'Fotos e Vídeos',
      login: 'Entrar'
    },
    footer: {
      copyright: '© 2025 Sistema Tucuju Tecnologia',
    },
    home: {
      title: 'Mapa Interativo',
      description: 'Clique em uma localidade no mapa para ver informações detalhadas.',
    },
    locations: {
      macapa: {
        name: 'Macapá',
        description: 'Capital do Amapá, cortada pela linha do Equador'
      },
      santana: {
        name: 'Santana',
        description: 'Segundo maior município do estado, importante porto fluvial'
      },
      laranjal: {
        name: 'Laranjal do Jari',
        description: 'Maior produtor de castanha-do-pará do estado'
      },
      oiapoque: {
        name: 'Oiapoque',
        description: 'Cidade fronteiriça com a Guiana Francesa'
      }
    },
    locationDetails: {
      loading: 'Carregando...',
      notFound: {
        title: 'Localização não encontrada',
        message: 'Não foram encontrados dados para a localização solicitada.',
        backButton: 'Voltar para o início'
      },
      error: {
        title: 'Erro ao carregar dados',
        backButton: 'Voltar para o início',
        connectionFailed: 'Não foi possível conectar ao servidor. Verifique se a API está em execução.',
        cityNotFound: 'Não foram encontrados dados para a cidade com ID {{id}}.',
        serverError: 'Erro do servidor: {{status}} - {{statusText}}',
        networkError: 'Erro de conexão com o servidor.',
        generalError: 'Erro: {{message}}',
        unknownError: 'Ocorreu um erro desconhecido ao carregar os dados.'
      },
      indicators: {
        title: 'Indicadores',
        population: 'População',
        area: 'Área',
        gdp: 'PIB per capita',
        hdi: 'IDH'
      },
      galleries: {
        title: 'Galerias',
        imageGalleries: 'Galerias de Imagens',
        viewGalleryButton: 'Ver galeria no POTEDES'
      },
      digitalCollection: {
        title: 'Acervo Digital',
        noDocuments: 'Nenhum documento encontrado.',
        noDate: 'N/D',
        unknownAuthor: 'Autor desconhecido',
        searchFilters: 'Filtros de Busca',
        search: {
          general: 'Busca geral...',
          year: 'Ano...',
          author: 'Autor...',
          tags: 'Tags...'
        },
        tabs: {
          livros: 'Livros',
          relatorios: 'Relatórios',
          artigos: 'Artigos',
          outros: 'Outros'
        },
        table: {
          title: 'Título',
          author: 'Autor',
          year: 'Ano',
          category: 'Categoria',
          action: 'Ação'
        },
        actions: {
          access: 'Acessar',
          download: 'Download',
          unavailable: 'Indisponível'
        },
        categories: {
          books: 'Livros',
          reports: 'Relatórios',
          articles: 'Artigos',
          others: 'Outros'
        }
      },
      categories: {
        health: 'Saúde',
        population: 'População',
        commerce: 'Comércio',
        education: 'Educação',
        environment: 'Meio Ambiente'
      },
      categoryTitles: {
        health: 'Números da Saúde',
        population: 'Números da População',
        commerce: 'Números do Comércio',
        education: 'Números da Educação',
        environment: 'Números do Meio Ambiente'
      },
      categoryData: {
        health: 'Dados de Saúde',
        population: 'Dados Demográficos',
        commerce: 'Dados Comerciais',
        education: 'Estatísticas Educacionais',
        environment: 'Indicadores Ambientais'
      },
      noData: {
        health: 'Não há dados de saúde disponíveis para esta cidade.',
        population: 'Não há dados de população disponíveis para esta cidade.',
        commerce: 'Não há dados de comércio disponíveis para esta cidade.',
        education: 'Não há dados de educação disponíveis para esta cidade.',
        environment: 'Não há dados de meio ambiente disponíveis para esta cidade.'
      },
      yearPeriod: 'Período:',
      source: 'Fonte:',
      moreIndicators: {
        health: 'Mais Indicadores de Saúde',
        population: 'Mais Indicadores de População',
        commerce: 'Mais Indicadores de Comércio',
        education: 'Mais Indicadores de Educação',
        environment: 'Mais Indicadores de Meio Ambiente'
      }
    },
    collaborate: {
      title: 'Colabore Conosco',
      description: 'Sua contribuição é valiosa para enriquecer nosso acervo digital. Compartilhe documentos, fotos, vídeos ou envie suas sugestões para ajudar a preservar e divulgar a história e cultura do Amapá.',
      form: {
        fullName: {
          label: 'Nome Completo',
          placeholder: 'Seu nome completo'
        },
        email: {
          label: 'E-mail',
          placeholder: 'seu.email@exemplo.com'
        },
        phone: {
          label: 'Telefone',
          placeholder: '(96) 99999-9999'
        },
        subject: {
          label: 'Assunto',
          placeholder: 'Assunto da mensagem'
        },
        message: {
          label: 'Mensagem',
          placeholder: 'Descreva sua contribuição ou mensagem...'
        },
        files: {
          label: 'Arquivos (opcional)',
          dragText: 'Arraste e solte arquivos aqui ou',
          buttonText: 'Selecione arquivos',
          fileSize: 'KB'
        },
        submit: 'Enviar Mensagem'
      }
    },
    auth: {
      login: {
        title: 'Bem-vindo de volta',
        subtitle: 'Faça login para acessar sua conta',
        submit: 'Entrar',
        switchToRegister: 'Não tem uma conta? Registre-se'
      },
      register: {
        title: 'Criar uma conta',
        subtitle: 'Registre-se para começar',
        submit: 'Registrar',
        switchToLogin: 'Já tem uma conta? Faça login'
      },
      form: {
        name: 'Nome',
        namePlaceholder: 'Seu nome completo',
        email: 'E-mail',
        emailPlaceholder: 'seu.email@exemplo.com',
        password: 'Senha',
        passwordPlaceholder: 'Sua senha',
        confirmPassword: 'Confirmar senha',
        confirmPasswordPlaceholder: 'Confirme sua senha'
      }
    },
    admin: {
      menu: {
        dashboard: 'Dashboard',
        locations: 'Localidades',
        indicators: 'Indicadores',
        gallery: 'Galeria',
        collection: 'Acervo Digital',
        users: 'Usuários',
        collaboration: 'Colaborações',
        reports: 'Relatórios',
        logout: 'Sair'
      },
      dashboard: {
        title: 'Dashboard',
        blocks: {
          locations: {
            title: 'Localidades',
            empty: 'Nenhuma localidade encontrada',
            add: 'Adicionar localidade'
          },
          users: {
            title: 'Usuários',
            empty: 'Nenhum usuário encontrado',
            add: 'Adicionar usuário'
          },
          documents: {
            title: 'Documentos',
            empty: 'Nenhum documento encontrado',
            add: 'Adicionar documento'
          },
          collaborations: {
            title: 'Colaborações',
            empty: 'Nenhuma colaboração encontrada'
          }
        },
        recentActivity: 'Atividade Recente',
        actions: {
          edit: 'Editar',
          delete: 'Excluir',
          view: 'Visualizar',
          approve: 'Aprovar',
          reject: 'Rejeitar'
        }
      }
    }
  },
};