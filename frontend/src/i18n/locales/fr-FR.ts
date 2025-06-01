export default {
  translation: {
    languageSelector: 'Sélectionnez la langue',
    twinCities: 'Villes Jumelles',
    noTwinCitiesFound: 'Aucune ville jumelle trouvée',
    menu: {
      home: 'Accueil',
      digitalCollection: 'Collection Numérique',
      collaborate: 'Collaborez avec Nous',
      gallery: 'Photos et Vidéos',
      login: 'Se connecter'
    },
    footer: {
      copyright: '© 2025 Système Tucuju Technologie',
    },
    home: {
      title: 'Carte Interactive',
      description: 'Cliquez sur un emplacement sur la carte pour voir les informations détaillées.',
    },
    locations: {
      macapa: {
        name: 'Macapá',
        description: 'Capitale de l\'Amapá, traversée par la ligne de l\'équateur'
      },
      santana: {
        name: 'Santana',
        description: 'Deuxième plus grande ville de l\'état, port fluvial important'
      },
      laranjal: {
        name: 'Laranjal do Jari',
        description: 'Plus grand producteur de noix du Brésil de l\'état'
      },
      oiapoque: {
        name: 'Oiapoque',
        description: 'Ville frontalière avec la Guyane Française'
      }
    },
    locationDetails: {
      loading: 'Chargement...',
      notFound: {
        title: 'Emplacement non trouvé',
        message: 'Aucune donnée trouvée pour l\'emplacement demandé.',
        backButton: 'Retour à l\'accueil'
      },
      error: {
        title: 'Erreur lors du chargement des données',
        backButton: 'Retour à l\'accueil',
        connectionFailed: 'Impossible de se connecter au serveur. Veuillez vérifier si l\'API fonctionne.',
        cityNotFound: 'Aucune donnée trouvée pour la ville avec l\'ID {{id}}.',
        serverError: 'Erreur serveur: {{status}} - {{statusText}}',
        networkError: 'Erreur de connexion avec le serveur.',
        generalError: 'Erreur: {{message}}',
        unknownError: 'Une erreur inconnue s\'est produite lors du chargement des données.'
      },
      indicators: {
        title: 'Indicateurs',
        population: 'Population',
        area: 'Superficie',
        gdp: 'PIB par habitant',
        hdi: 'IDH'
      },
      galleries: {
        title: 'Galeries',
        imageGalleries: 'Galeries d\'Images',
        viewGalleryButton: 'Voir la galerie sur POTEDES'
      },
      digitalCollection: {
        title: 'Collection Numérique',
        noDocuments: 'Aucun document trouvé.',
        noDate: 'N/D',
        unknownAuthor: 'Auteur inconnu',
        searchFilters: 'Filtres de Recherche',
        search: {
          general: 'Recherche générale...',
          year: 'Année...',
          author: 'Auteur...',
          tags: 'Tags...'
        },
        tabs: {
          livros: 'Livres',
          relatorios: 'Rapports',
          artigos: 'Articles',
          outros: 'Autres'
        },
        table: {
          title: 'Titre',
          author: 'Auteur',
          year: 'Année',
          category: 'Catégorie',
          action: 'Action'
        },
        actions: {
          access: 'Accéder',
          download: 'Télécharger',
          unavailable: 'Indisponible'
        },
        categories: {
          books: 'Livres',
          reports: 'Rapports',
          articles: 'Articles',
          others: 'Autres'
        }
      },
      categories: {
        health: 'Santé',
        population: 'Population',
        commerce: 'Commerce',
        education: 'Éducation',
        environment: 'Environnement'
      },
      categoryTitles: {
        health: 'Chiffres de la Santé',
        population: 'Chiffres de la Population',
        commerce: 'Chiffres du Commerce',
        education: 'Chiffres de l\'Éducation',
        environment: 'Chiffres de l\'Environnement'
      },
      categoryData: {
        health: 'Données de Santé',
        population: 'Données Démographiques',
        commerce: 'Données Commerciales',
        education: 'Statistiques Éducatives',
        environment: 'Indicateurs Environnementaux'
      },
      noData: {
        health: 'Aucune donnée de santé disponible pour cette ville.',
        population: 'Aucune donnée de population disponible pour cette ville.',
        commerce: 'Aucune donnée commerciale disponible pour cette ville.',
        education: 'Aucune donnée d\'éducation disponible pour cette ville.',
        environment: 'Aucune donnée environnementale disponible pour cette ville.'
      },
      yearPeriod: 'Période:',
      source: 'Source:',
      moreIndicators: {
        health: 'Plus d\'Indicateurs de Santé',
        population: 'Plus d\'Indicateurs de Population',
        commerce: 'Plus d\'Indicateurs de Commerce',
        education: 'Plus d\'Indicateurs d\'Éducation',
        environment: 'Plus d\'Indicateurs d\'Environnement'
      }
    },
    collaborate: {
      title: 'Collaborez avec Nous',
      description: 'Votre contribution est précieuse pour enrichir notre collection numérique. Partagez des documents, des photos, des vidéos ou envoyez vos suggestions pour aider à préserver et à diffuser l\'histoire et la culture de l\'Amapá.',
      form: {
        fullName: {
          label: 'Nom Complet',
          placeholder: 'Votre nom complet'
        },
        email: {
          label: 'E-mail',
          placeholder: 'votre.email@exemple.com'
        },
        phone: {
          label: 'Téléphone',
          placeholder: '(96) 99999-9999'
        },
        subject: {
          label: 'Sujet',
          placeholder: 'Sujet du message'
        },
        message: {
          label: 'Message',
          placeholder: 'Décrivez votre contribution ou message...'
        },
        files: {
          label: 'Fichiers (optionnel)',
          dragText: 'Glissez et déposez des fichiers ici ou',
          buttonText: 'Sélectionnez des fichiers',
          fileSize: 'Ko'
        },
        submit: 'Envoyer le Message'
      }
    },
    auth: {
      login: {
        title: 'Bienvenue',
        subtitle: 'Connectez-vous à votre compte',
        submit: 'Se connecter',
        switchToRegister: 'Pas de compte ? Inscrivez-vous'
      },
      register: {
        title: 'Créer un compte',
        subtitle: 'Inscrivez-vous pour commencer',
        submit: 'S\'inscrire',
        switchToLogin: 'Déjà un compte ? Connectez-vous'
      },
      form: {
        name: 'Nom',
        namePlaceholder: 'Votre nom complet',
        email: 'E-mail',
        emailPlaceholder: 'votre.email@exemple.com',
        password: 'Mot de passe',
        passwordPlaceholder: 'Votre mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        confirmPasswordPlaceholder: 'Confirmez votre mot de passe'
      }
    },
    admin: {
      menu: {
        dashboard: 'Tableau de bord',
        locations: 'Localités',
        indicators: 'Indicateurs',
        gallery: 'Galerie',
        collection: 'Collection Numérique',
        users: 'Utilisateurs',
        collaboration: 'Collaborations',
        reports: 'Rapports',
        logout: 'Se déconnecter'
      },
      dashboard: {
        title: 'Tableau de bord',
        blocks: {
          locations: {
            title: 'Localités',
            empty: 'Aucune localité trouvée',
            add: 'Ajouter une localité'
          },
          users: {
            title: 'Utilisateurs',
            empty: 'Aucun utilisateur trouvé',
            add: 'Ajouter un utilisateur'
          },
          documents: {
            title: 'Documents',
            empty: 'Aucun document trouvé',
            add: 'Ajouter un document'
          },
          collaborations: {
            title: 'Collaborations',
            empty: 'Aucune collaboration trouvée'
          }
        },
        recentActivity: 'Activité Récente',
        actions: {
          edit: 'Modifier',
          delete: 'Supprimer',
          view: 'Voir',
          approve: 'Approuver',
          reject: 'Rejeter'
        }
      }
    }
  },
};