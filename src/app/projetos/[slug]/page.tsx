import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Calendar, Ruler, MapPin, Grid, ArrowLeft, ArrowRight } from 'lucide-react';
import BeforeAfter from '@/components/BeforeAfter';
import styles from './page.module.css';

// Fallback project data
const defaultProjects: Record<string, any> = {
  'apartamento-vicente-pires': {
    title: 'Apartamento Vicente Pires',
    category: 'residencial',
    city: 'Brasília - DF',
    area: 110,
    year: 2025,
    main_image: '/projects/res-1.png',
    gallery: [
      '/projects/res-1.png',
      '/projects/res-2.png',
      '/projects/res-3.jpg',
      '/projects/res-4.jpg',
      '/projects/res-5.jpg'
    ],
    description: 'Este projeto de interiores residencial em Brasília (Vicente Pires) foi concebido para otimizar os espaços integrados de estar, jantar e cozinha. Destaca-se o uso de painéis ripados de madeira natural que criam uma divisória elegante e acolhedora, aliando funcionalidade e estética de alto padrão. A iluminação linear em LED embutida na marcenaria Off-White confere sofisticação e conforto visual a todo o ambiente.'
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
