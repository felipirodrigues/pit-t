export default {
  translation: {
    languageSelector: 'Select language',
    twinCities: 'Twin Cities',
    noTwinCitiesFound: 'No twin cities found',
    menu: {
      home: 'Home',
      digitalCollection: 'Digital Collection',
      collaborate: 'Collaborate With Us',
      gallery: 'Photos and Videos',
      login: 'Login'
    },
    footer: {
      copyright: '© 2025 Tucuju Technology System',
    },
    home: {
      title: 'Interactive Map',
      description: 'Click on a location on the map to see detailed information.',
    },
    locations: {
      macapa: {
        name: 'Macapá',
        description: 'Capital of Amapá, crossed by the Equator line'
      },
      santana: {
        name: 'Santana',
        description: 'Second largest municipality in the state, important river port'
      },
      laranjal: {
        name: 'Laranjal do Jari',
        description: 'Largest Brazil nut producer in the state'
      },
      oiapoque: {
        name: 'Oiapoque',
        description: 'Border city with French Guiana'
      }
    },
    locationDetails: {
      loading: 'Loading...',
      notFound: {
        title: 'Location not found',
        message: 'No data found for the requested location.',
        backButton: 'Back to home'
      },
      error: {
        title: 'Error loading data',
        backButton: 'Back to home',
        connectionFailed: 'Unable to connect to server. Please check if API is running.',
        cityNotFound: 'No data found for city with ID {{id}}.',
        serverError: 'Server error: {{status}} - {{statusText}}',
        networkError: 'Connection error with server.',
        generalError: 'Error: {{message}}',
        unknownError: 'An unknown error occurred while loading data.'
      },
      indicators: {
        title: 'Indicators',
        population: 'Population',
        area: 'Area',
        gdp: 'GDP per capita',
        hdi: 'HDI'
      },
      galleries: {
        title: 'Galleries',
        imageGalleries: 'Image Galleries',
        viewGalleryButton: 'View gallery on POTEDES'
      },
      digitalCollection: {
        title: 'Digital Collection',
        noDocuments: 'No documents found.',
        noDate: 'N/A',
        unknownAuthor: 'Unknown author',
        searchFilters: 'Search Filters',
        search: {
          general: 'General search...',
          year: 'Year...',
          author: 'Author...',
          tags: 'Tags...'
        },
        tabs: {
          livros: 'Books',
          relatorios: 'Reports',
          artigos: 'Articles',
          outros: 'Others'
        },
        table: {
          title: 'Title',
          author: 'Author',
          year: 'Year',
          category: 'Category',
          action: 'Action'
        },
        actions: {
          access: 'Access',
          download: 'Download',
          unavailable: 'Unavailable'
        },
        categories: {
          books: 'Books',
          reports: 'Reports',
          articles: 'Articles',
          others: 'Others'
        }
      },
      categories: {
        health: 'Health',
        population: 'Population',
        commerce: 'Commerce',
        education: 'Education',
        environment: 'Environment'
      },
      categoryTitles: {
        health: 'Health Numbers',
        population: 'Population Numbers',
        commerce: 'Commerce Numbers',
        education: 'Education Numbers',
        environment: 'Environment Numbers'
      },
      categoryData: {
        health: 'Health Data',
        population: 'Demographic Data',
        commerce: 'Commercial Data',
        education: 'Educational Statistics',
        environment: 'Environmental Indicators'
      },
      noData: {
        health: 'No health data available for this city.',
        population: 'No population data available for this city.',
        commerce: 'No commerce data available for this city.',
        education: 'No education data available for this city.',
        environment: 'No environment data available for this city.'
      },
      yearPeriod: 'Period:',
      source: 'Source:',
      moreIndicators: {
        health: 'More Health Indicators',
        population: 'More Population Indicators',
        commerce: 'More Commerce Indicators',
        education: 'More Education Indicators',
        environment: 'More Environment Indicators'
      }
    },
    collaborate: {
      title: 'Collaborate With Us',
      description: 'Your contribution is valuable to enrich our digital collection. Share documents, photos, videos or send your suggestions to help preserve and disseminate the history and culture of Amapá.',
      form: {
        fullName: {
          label: 'Full Name',
          placeholder: 'Your full name'
        },
        email: {
          label: 'Email',
          placeholder: 'your.email@example.com'
        },
        phone: {
          label: 'Phone',
          placeholder: '(96) 99999-9999'
        },
        subject: {
          label: 'Subject',
          placeholder: 'Message subject'
        },
        message: {
          label: 'Message',
          placeholder: 'Describe your contribution or message...'
        },
        files: {
          label: 'Files (optional)',
          dragText: 'Drag and drop files here or',
          buttonText: 'Select files',
          fileSize: 'KB'
        },
        submit: 'Send Message'
      }
    },
    auth: {
      login: {
        title: 'Welcome back',
        subtitle: 'Log in to access your account',
        submit: 'Login',
        switchToRegister: 'Don\'t have an account? Register'
      },
      register: {
        title: 'Create an account',
        subtitle: 'Register to get started',
        submit: 'Register',
        switchToLogin: 'Already have an account? Log in'
      },
      form: {
        name: 'Name',
        namePlaceholder: 'Your full name',
        email: 'Email',
        emailPlaceholder: 'your.email@example.com',
        password: 'Password',
        passwordPlaceholder: 'Your password',
        confirmPassword: 'Confirm password',
        confirmPasswordPlaceholder: 'Confirm your password'
      }
    },
    admin: {
      menu: {
        dashboard: 'Dashboard',
        locations: 'Locations',
        indicators: 'Indicators',
        gallery: 'Gallery',
        collection: 'Digital Collection',
        users: 'Users',
        collaboration: 'Collaborations',
        reports: 'Reports',
        logout: 'Logout'
      },
      dashboard: {
        title: 'Dashboard',
        blocks: {
          locations: {
            title: 'Locations',
            empty: 'No locations found',
            add: 'Add location'
          },
          users: {
            title: 'Users',
            empty: 'No users found',
            add: 'Add user'
          },
          documents: {
            title: 'Documents',
            empty: 'No documents found',
            add: 'Add document'
          },
          collaborations: {
            title: 'Collaborations',
            empty: 'No collaborations found'
          }
        },
        recentActivity: 'Recent Activity',
        actions: {
          edit: 'Edit',
          delete: 'Delete',
          view: 'View',
          approve: 'Approve',
          reject: 'Reject'
        }
      }
    }
  },
}; 