import { supabase } from '@/lib/supabase';
import BlogList from '@/components/BlogList';
import styles from './page.module.css';

export const metadata = {
  title: "Blog | Palloma Duarte Arquitetura",
  description: "Dicas de decoração de alto padrão, tendências de arquitetura residencial e comercial, e orientações exclusivas de reforma.",
};

const defaultPosts = [
  {
    id: '1',
    title: 'Tendências de Arquitetura de Interiores de Alto Padrão para 2026',
    slug: 'tendencias-arquitetura-interiores-2026',
    summary: 'Exploramos o uso de formas orgânicas, revestimentos táteis como pedras naturais e texturas bouclé, e a fusão de automação discreta com design biofílico.',
    main_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    published_at: '2026-06-10T12:00:00Z',
    category: 'Tendências',
    views: 142
  },
  {
    id: '2',
    title: 'Como Planejar a Iluminação da Sua Sala de Estar: Guia Prático',
    slug: 'como-planejar-iluminacao-sala-de-estar',
    summary: 'Entenda a diferença entre iluminação geral difusa, iluminação de destaque e decorativa. Aprenda a criar cenários de luz quente acolhedores.',
    main_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    published_at: '2026-05-28T14:30:00Z',
    category: 'Arquitetura',
    views: 89
  },
  {
    id: '3',
    title: 'O Guia Definitivo para Escolher Revestimentos de Luxo Sem Erros',
    slug: 'guia-revestimentos-de-luxo',
    summary: 'Das lâminas ultra-compactas (Dekton) aos mármores clássicos. Saiba quais materiais usar em áreas úmidas, pisos de alto tráfego e painéis decorativos.',
    main_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    published_at: '2026-05-15T09:00:00Z',
    category: 'Dicas de Reforma',
    views: 210
  }
];

async function getBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultPosts;
    }
    return data;
  } catch (e) {
    return defaultPosts;
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className={styles.blogPage}>
      {/* Header */}
      <section className={styles.hero}>
        <div className="container">
          <span className="section-subtitle">Conhecimento Compartilhado</span>
          <h1 className={styles.title}>Blog Palloma Duarte</h1>
          <p className={styles.subtitle}>
            Aprenda a valorizar o seu imóvel e descubra dicas, tendências e orientações completas de arquitetura, reforma e decoração de luxo.
          </p>
        </div>
      </section>

      {/* Blog List Section */}
      <section className={styles.listSection}>
        <div className="container">
          <BlogList initialPosts={posts} />
        </div>
      </section>
    </div>
  );
}
