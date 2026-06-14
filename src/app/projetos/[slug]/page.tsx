import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Calendar, Ruler, MapPin, Grid, ArrowLeft, ArrowRight } from 'lucide-react';
import BeforeAfter from '@/components/BeforeAfter';
import styles from './page.module.css';

// Fallback project data
const defaultProjects: Record<string, any> = {
  'penthouse-bela-vista': {
    title: 'Penthouse Bela Vista',
    category: 'residencial',
    city: 'Porto Alegre',
    area: 280,
    year: 2024,
    main_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800'
    ],
    before_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    after_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    description: 'A Penthouse Bela Vista foi planejada sob a ótica da integração máxima dos ambientes sociais, mantendo a privacidade da área íntima. O uso de mármore Travertino Romano bruto no painel principal, combinado com painéis de madeira nogueira natural e iluminação linear oculta, define a assinatura do design de luxo discreto deste apartamento de cobertura.'
  },
  'clinica-dermato-dr': {
    title: 'Clínica Dermatológica D&R',
    category: 'clinicas_consultorios',
    city: 'São Paulo',
    area: 120,
    year: 2023,
    main_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584515901387-a7a1a6373142?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Projetar um espaço de saúde exige rigor sanitário e profunda ergonomia, mas a Clínica D&R vai além: o conceito criativo se assemelha a um spa boutique de luxo. A paleta Off-White, as formas orgânicas esculpidas no gesso, as texturas de pedras nobres e a marcenaria curva transmitem tranquilidade, assepsia e credibilidade médica instantânea.'
  },
  'residencia-terras-verdes': {
    title: 'Residência Terras Verdes',
    category: 'residencial',
    city: 'Caxias do Sul',
    area: 450,
    year: 2022,
    main_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Esta residência de veraneio explora a relação direta entre o interior sofisticado e as vistas exuberantes da serra. Estruturada em concreto aparente e fechamentos em grandes vãos de vidro térmico, a casa conta com marcenaria integrada e lareira central suspensa em chapa de ferro naval oxidado.'
  }
};

async function getProjectBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return defaultProjects[slug] || null;
    }
    return data;
  } catch (e) {
    return defaultProjects[slug] || null;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);
  if (!project) {
    return {
      title: 'Projeto Não Encontrado | Palloma Duarte Arquitetura',
    };
  }
  return {
    title: `${project.title} | Palloma Duarte Arquitetura`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const categoryLabels: Record<string, string> = {
    residencial: 'Residencial',
    comercial: 'Comercial',
    clinicas_consultorios: 'Clínica',
    corporativo: 'Corporativo'
  };

  return (
    <div className={styles.projectPage}>
      {/* Back Button Bar */}
      <div className={styles.topBar}>
        <div className="container">
          <Link href="/projetos" className={styles.backLink}>
            <ArrowLeft size={16} />
            Voltar para Portfólio
          </Link>
        </div>
      </div>

      {/* Main Image Header */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <img
          src={project.main_image}
          alt={project.title}
          className={styles.heroImg}
        />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.categoryBadge}>
            {categoryLabels[project.category] || project.category}
          </span>
          <h1 className={styles.title}>{project.title}</h1>
        </div>
      </section>

      {/* Project Specs */}
      <section className={styles.specs}>
        <div className="container">
          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <MapPin size={20} className={styles.specIcon} />
              <div>
                <strong>Localização</strong>
                <span>{project.city}</span>
              </div>
            </div>
            <div className={styles.specItem}>
              <Ruler size={20} className={styles.specIcon} />
              <div>
                <strong>Área Construída</strong>
                <span>{project.area} m²</span>
              </div>
            </div>
            <div className={styles.specItem}>
              <Calendar size={20} className={styles.specIcon} />
              <div>
                <strong>Ano de Conclusão</strong>
                <span>{project.year}</span>
              </div>
            </div>
            <div className={styles.specItem}>
              <Grid size={20} className={styles.specIcon} />
              <div>
                <strong>Tipologia</strong>
                <span>{categoryLabels[project.category] || project.category}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative & Before/After */}
      <section className={styles.content}>
        <div className="container">
          <div className={styles.contentLayout}>
            <div className={styles.descriptionCol}>
              <span className="section-subtitle">A Narrativa do Projeto</span>
              <h2>Conceito & Soluções Desenvolvidas</h2>
              <p className={styles.descriptionText}>{project.description}</p>
            </div>

            {/* Before After Transformation inside the Project if available */}
            {project.before_image && project.after_image && (
              <div className={styles.transformationBox}>
                <span className="section-subtitle">Antes & Depois</span>
                <h3>Visualizar a Transformação</h3>
                <div className={styles.sliderWrapper}>
                  <BeforeAfter
                    beforeImage={project.before_image}
                    afterImage={project.after_image}
                    beforeLabel="Antes"
                    afterLabel="Depois"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      {project.gallery && project.gallery.length > 0 && (
        <section className={styles.gallerySection}>
          <div className="container">
            <span className="section-subtitle">Galeria de Detalhes</span>
            <h2 className={styles.galleryTitle}>Fotografia Editorial do Espaço</h2>
            <div className={styles.galleryGrid}>
              {project.gallery.map((imgUrl: string, idx: number) => (
                <div key={idx} className={styles.galleryItem}>
                  <img
                    src={imgUrl}
                    alt={`${project.title} - Foto ${idx + 1}`}
                    className={styles.galleryImg}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Conversion CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>Deseja um resultado semelhante para o seu espaço?</h2>
            <p>Faça uma reunião rápida de 30 minutos com a arquiteta para analisar as possibilidades do seu imóvel.</p>
            <Link href="/#agendamento" className="btn-gold">
              Agendar Conversa de Diagnóstico
              <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
