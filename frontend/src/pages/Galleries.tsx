import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Oiaporque from '../images/oiapoque.jpg'
import SaintGeorges from '../images/saintgeorge.jpg'
import Lethem from '../images/lethem.jpg'
import Bonfim from '../images/bonfim.jpeg'
import Albina from '../images/albina.jpg'

// Interfaces
interface GalleryImage {
  url: string;
  alt: string;
}

interface GalleryItem {
  id: number;
  title: string;
  city: string;
  country: string;
  description: string;
  coverImage: string;
  tagline: string;
  images: GalleryImage[];
  featured?: boolean;
}

const Galleries: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [featuredGallery, setFeaturedGallery] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para mudar a galeria em destaque
  const setAsFeatured = (galleryId: number) => {
    const selected = galleries.find(gallery => gallery.id === galleryId) || null;
    setFeaturedGallery(selected);
  };

  // Carregar dados mockados das galerias
  useEffect(() => {
    // Simulando um carregamento de dados
    setTimeout(() => {
      const mockGalleries: GalleryItem[] = [
        {
          id: 1,
          title: "Oiapoque",
          city: "Oiapoque",
          country: "Brasil",
          tagline: "Aqui começa o Brasil",
          description: "Explore os pontos turísticos de Oiapoque, cidade localizada no extremo norte do Brasil. Conhecida como o início do Brasil, Oiapoque abriga o Marco Zero e a ponte binacional que liga o Brasil à Guiana Francesa.",
          coverImage: Oiaporque,
          images: [
            { url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Ponte_Oiapoque_geral.jpg", alt: "Ponte Binacional" },
            { url: "https://www.gov.br/mre/pt-br/assuntos/noticias/ponte-brasil-franca-no-amapa-comeca-a-receber-veiculos-estrangeiros/arco_capa_pica.jpg/@@images/image/full", alt: "Marco Fronteiriço" },
            { url: "https://i0.wp.com/www.portalholofote.com.br/wp-content/uploads/2023/09/WhatsApp-Image-2023-09-13-at-17.29.59-1.jpeg", alt: "Vista da Cidade" },
            { url: "https://diariodoamapa.com.br/wp-content/uploads/2023/03/Oiapoque-Marco-Zero-1-1280x720.jpg", alt: "Marco Zero" }
          ],
          featured: true
        },
        {
          id: 2,
          title: "Saint-Georges",
          city: "Saint-Georges",
          country: "Guiana Francesa",
          tagline: "A porta de entrada da Europa na Amazônia",
          description: "Saint-Georges-de-l'Oyapock é uma comuna francesa situada na fronteira com o Brasil. Com forte influência da cultura francesa, possui uma arquitetura única e espaços culturais que demonstram a mistura de culturas europeias e amazônicas.",
          coverImage: SaintGeorges,
          images: [
            { url: "https://www.ctguyane.fr/app/uploads/Saint-Georges-scaled.jpg", alt: "Vista de Saint-Georges" },
            { url: "https://www.blada.com/data/File/2018/jgaillot30104.jpg", alt: "Rua de Saint-Georges" },
            { url: "https://3.bp.blogspot.com/-YkBbfZK6vw8/V_uiIBqGg9I/AAAAAAAAUUI/JYzrkpX7GwYYkhiR05S9i5q7ozrDZf8IgCLcB/s1600/Saint-georges-guiana-francesa.jpg", alt: "Rio Oiapoque" },
            { url: "https://www.blada.com/data/File/2020/jmarlin19021.jpg", alt: "Praça Central" }
          ]
        },
        {
          id: 3,
          title: "Lethem",
          city: "Lethem",
          country: "Guiana",
          tagline: "Centro comercial na fronteira guianense",
          description: "Lethem é uma cidade situada na fronteira entre Guiana e Brasil, e é um importante centro comercial. A cidade é conhecida por sua cultura diversificada e arquitetura colonial.",
          coverImage: Lethem,
          images: [
            { url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Lethem%2C_Guyana_%287177398742%29.jpg", alt: "Vista de Lethem" },
            { url: "https://cdn.jornaldebrasilia.com.br/wp-content/uploads/2023/01/11152642/lethem.jpg", alt: "Comércio Local" },
            { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Lethem%2C_Guyana_%287177473178%29.jpg/1200px-Lethem%2C_Guyana_%287177473178%29.jpg", alt: "Estrada de Lethem" },
            { url: "https://www.ceiri.news/wp-content/uploads/2022/09/https___cdn.cnn_.com_cnnnext_dam_assets_220908143943-01-takutu-river-bridge.jpeg", alt: "Ponte sobre o Rio Takutu" }
          ]
        },
        {
          id: 4,
          title: "Bonfim",
          city: "Bonfim",
          country: "Brasil",
          tagline: "Fronteira e comércio na Amazônia setentrional",
          description: "Bonfim, município brasileiro localizado no estado de Roraima, faz fronteira com Lethem, na Guiana. A cidade é conhecida pela ponte internacional sobre o rio Tacutu e pelo comércio fronteiriço.",
          coverImage: Bonfim,
          images: [
            { url: "https://cdn.folhabv.com.br/images/v1/2023/04/f2c5a8ecfad7ab2eb70c06c0242da7e1.jpg", alt: "Vista de Bonfim" },
            { url: "https://horahotv.com.br/portal/wp-content/uploads/2021/12/bonfim-900x598.jpg", alt: "Cidade de Bonfim" },
            { url: "https://www.viajarturturtour.com.br/sites/viajarturturtour.com.br/files/2022-09/Imagem%20site%20FLIX%20%282%29.png", alt: "Rio Tacutu" },
            { url: "https://www.atribunarn.com.br/wp-content/uploads/2023/02/ponte-guiana-e1676555070536.jpeg", alt: "Ponte Brasil-Guiana" }
          ]
        },
        {
          id: 5,
          title: "Albina",
          city: "Albina",
          country: "Suriname",
          tagline: "Porto e passagem às margens do rio Marowijne",
          description: "Albina é uma cidade portuária do Suriname, localizada na margem oeste do rio Marowijne, que forma a fronteira com a Guiana Francesa. É um importante ponto de travessia para Saint-Laurent-du-Maroni.",
          coverImage: Albina,
          images: [
            { url: "https://www.travelmarker.nl/media/1055/suriname-albina-korjaal-transport-naar-frans-guyana.jpg", alt: "Porto de Albina" },
            { url: "https://upload.wikimedia.org/wikipedia/commons/6/60/Albina_Suriname.JPG", alt: "Vista de Albina" },
            { url: "https://www.waterkant.net/wp-content/uploads/2021/12/ALBINA-SURINAME.jpg", alt: "Ruas de Albina" },
            { url: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Suriname_Albina_%28255599076%29.jpeg", alt: "Rio Marowijne" }
          ]
        }
      ];

      setGalleries(mockGalleries);
      setFeaturedGallery(mockGalleries.find(gallery => gallery.featured) || mockGalleries[0]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Componente para o grid de galerias
  const GalleryGrid = () => {
    return (
      <div className="relative mt-8 px-4 md:px-8 max-w-[1400px] mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">Galerias das Cidades Gêmeas</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-10">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className={`h-60 rounded-xl overflow-hidden relative cursor-pointer transition-all duration-300 shadow-md transform ${
                featuredGallery?.id === gallery.id 
                ? 'ring-4 ring-green-500 shadow-xl scale-[1.02]' 
                : 'hover:shadow-lg hover:scale-[1.05] hover:-translate-y-2'
              }`}
              onClick={() => setAsFeatured(gallery.id)}
            >
              <img
                src={gallery.coverImage}
                alt={gallery.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl text-white font-bold">{gallery.title}</h3>
                <p className="text-white/90 text-sm mt-1">{gallery.tagline}</p>
                <p className="text-white/80 text-xs mt-1">{gallery.country}</p>
              </div>
              {featuredGallery?.id === gallery.id && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente para o destaque
  const FeaturedGallery = () => {
    if (!featuredGallery) return null;

    return (
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredGallery.coverImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {featuredGallery.title}
          </h1>
          <p className="text-xl text-white/90 mb-1">
            {featuredGallery.tagline}
          </p>
          <p className="text-lg text-white/80 mb-3">
            {featuredGallery.country}
          </p>
          <p className="text-white/80 text-base max-w-3xl mb-6 hidden md:block">
            {featuredGallery.description}
          </p>
          
          <div className="flex space-x-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
              <Play size={20} /> Ver Galeria
            </button>
            
          </div>
        </div>
        
      </div>
    );
  };

  // Página principal
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      
      <div className="pt-16 md:pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <FeaturedGallery />
            <GalleryGrid />
          </>
        )}
      </div>
    </div>
  );
};

export default Galleries; 