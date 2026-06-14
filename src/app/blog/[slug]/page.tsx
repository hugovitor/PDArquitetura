import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Calendar, Eye, ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

// Fallback articles
const defaultArticles: Record<string, any> = {
  'tendencias-arquitetura-interiores-2026': {
    title: 'Tendências de Arquitetura de Interiores de Alto Padrão para 2026',
    category: 'Tendências',
    published_at: '2026-06-10T12:00:00Z',
    views: 142,
    main_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
    summary: 'Exploramos o uso de formas orgânicas, revestimentos táteis como pedras naturais e texturas bouclé, e a fusão de automação discreta com design biofílico.',
    content: `A arquitetura de interiores em 2026 caminha a passos largos em direção a uma conexão mais sensorial, natural e intimista com os espaços de moradia. Modismos frios e superfícies excessivamente polidas e artificiais dão lugar a materiais honestos e texturas ricas.

### 1. Formas Orgânicas e Curvas Naturais
A rigidez das linhas retas e quinas secas está sendo suavizada por arcos arquitetônicos, sofás curvos e marcenaria de cantos arredondados. Esse movimento fluido promove uma transição espacial mais suave e traz uma sensação imediata de acolhimento e relaxamento neurológico.

### 2. Biofilia Integrada e Iluminação Solar
O design biofílico vai além de colocar vasos de plantas nos cantos da sala. Trata-se da integração da luz solar direta por rasgos de teto, ventilação cruzada e o uso de jardins internos integrados que mudam de cor conforme as estações do ano.

### 3. Revestimentos Táteis e Naturais
A escolha de revestimentos agora foca no toque. Pedras naturais brutas (mármores escovados, travertinos com poros abertos) e tecidos como linho encorpado, couro natural e bouclé são protagonistas. O objetivo é sentir o ambiente com o tato, gerando o que os especialistas chamam de 'aconchego tátil'.

### Conclusão
Em 2026, projetar um lar é desenhar um refúgio de bem-estar. A sofisticação reside na pureza dos materiais, no conforto acústico e térmico e na simplicidade das formas.`
  },
  'como-planejar-iluminacao-sala-de-estar': {
    title: 'Como Planejar a Iluminação da Sua Sala de Estar: Guia Prático',
    category: 'Arquitetura',
    published_at: '2026-05-28T14:30:00Z',
    views: 89,
    main_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    summary: 'Entenda a diferença entre iluminação geral difusa, iluminação de destaque e decorativa. Aprenda a criar cenários de luz quente acolhedores.',
    content: `A iluminação tem o poder de transformar completamente um ambiente. Uma sala de estar com iluminação errada pode parecer fria, plana e desconfortável. Por outro lado, um projeto luminotécnico bem planejado valoriza a decoração e cria o clima perfeito para relaxar ou receber amigos.

### 1. Iluminação Geral (Difusa)
A iluminação difusa serve para clarear todo o ambiente de forma uniforme. Em salas de luxo, evitamos o uso de uma única lâmpada centralizada no teto. Preferimos fitas de LED quente embutidas em rasgos no gesso, criando luz indireta refletida pelo teto, que não agride os olhos.

### 2. Iluminação de Destaque
Esta iluminação direciona o olhar para pontos específicos, como uma obra de arte na parede, um vaso de destaque ou um revestimento especial. Spots direcionáveis ocultos (com lâmpadas dicroicas ou mini-dicroicas de alta fidelidade de cor) são excelentes para esse fim.

### 3. Cenários e Automação
O segredo de uma sala sofisticada é a dimerização e os circuitos divididos. Você deve ser capaz de ligar apenas a iluminação indireta da marcenaria e o abajur de leitura ao assistir a um filme, ou iluminar toda a sala de jantar ao servir um jantar especial. A automação residencial simplifica isso em painéis de parede ou comandos de voz.

Invista em lâmpadas de temperatura de cor quente (entre 2700K e 3000K) para ambientes sociais, garantindo aconchego máximo.`
  }
};

async function getArticleBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return defaultArticles[slug] || null;
    }
    return data;
  } catch (e) {
    return defaultArticles[slug] || null;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);
  if (!article) {
    return {
      title: 'Artigo Não Encontrado | Palloma Duarte Arquitetura',
    };
  }
  return {
    title: `${article.seo_title || article.title} | Blog Palloma Duarte`,
    description: article.seo_description || article.summary,
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.articlePage}>
      {/* Top Navigation */}
      <div className={styles.topBar}>
        <div className="container">
          <Link href="/blog" className={styles.backLink}>
            <ArrowLeft size={16} />
            Voltar para o Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className={styles.header}>
        <div className="container">
          <span className={styles.categoryBadge}>{article.category}</span>
          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.summary}>{article.summary}</p>
          
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Calendar size={14} />
              <span>{formatDate(article.published_at)}</span>
            </div>
            <div className={styles.metaItem}>
              <Clock size={14} />
              <span>5 min de leitura</span>
            </div>
            <div className={styles.metaItem}>
              <Eye size={14} />
              <span>{article.views} visualizações</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="container">
        <div className={styles.imgWrapper}>
          <img
            src={article.main_image}
            alt={article.title}
            className={styles.mainImg}
          />
        </div>
      </div>

      {/* Content Layout */}
      <div className="container">
        <div className={styles.layout}>
          {/* Article Body */}
          <main className={styles.contentBody}>
            {article.content.split('\n\n').map((paragraph: string, idx: number) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className={styles.sectionTitle}>
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              return (
                <p key={idx} className={styles.paragraph}>
                  {paragraph}
                </p>
              );
            })}
          </main>

          {/* Sidebar CTA */}
          <aside className={styles.sidebar}>
            <div className={styles.ctaCard}>
              <span className={styles.ctaSubtitle}>Planejando Reformar?</span>
              <h3>Gostaria de discutir as suas ideias com Palloma Duarte?</h3>
              <p>Agende uma reunião inicial diagnóstica de 30 minutos via videochamada para mapear as potencialidades e estimar investimentos para o seu espaço.</p>
              <Link href="/#agendamento" className="btn-gold">
                Agendar Reunião Gratuita
                <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
