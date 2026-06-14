import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Compass, Shield, Award, Users, Star } from 'lucide-react';
import BeforeAfter from '@/components/BeforeAfter';
import BudgetCalculator from '@/components/BudgetCalculator';
import ProjectQuiz from '@/components/ProjectQuiz';
import MeetingScheduler from '@/components/MeetingScheduler';
import styles from './page.module.css';

// Fallback projects if Supabase is empty
const defaultProjects = [
  {
    id: '1',
    title: 'Penthouse Bela Vista',
    slug: 'penthouse-bela-vista',
    category: 'residencial',
    city: 'Porto Alegre',
    area: 280,
    main_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    description: 'Reforma completa de cobertura linear focando na integração social e materiais nobres.'
  },
  {
    id: '2',
    title: 'Clínica Dermatológica D&R',
    slug: 'clinica-dermato-dr',
    category: 'clinica',
    city: 'São Paulo',
    area: 120,
    main_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
    description: 'Espaço clínico projetado para transmitir bem-estar, assepsia e extremo luxo.'
  },
  {
    id: '3',
    title: 'Residência Terras Verdes',
    slug: 'residencia-terras-verdes',
    category: 'residencial',
    city: 'Caxias do Sul',
    area: 450,
    main_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    description: 'Casa contemporânea com forte presença de concreto aparente, madeira e vidro.'
  }
];

const defaultTestimonials = [
  {
    name: 'Carolina & Roberto Schmidt',
    role: 'Proprietários - Penthouse Bela Vista',
    content: 'O processo com a Palloma foi impecável do início ao fim. Ela conseguiu ler nossos desejos e traduzir em ambientes funcionais que impressionam a todos que nos visitam. Uma experiência de luxo real.',
    rating: 5
  },
  {
    name: 'Dra. Rebeca Cavalcanti',
    role: 'Fundadora - Clínica D&R',
    content: 'Nossos pacientes sempre elogiam o design da clínica. Além de lindo, o fluxo de trabalho dos médicos melhorou 100% devido à ergonomia pensada no layout. Altamente recomendado.',
    rating: 5
  }
];

async function getFeaturedProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_featured', true)
      .order('order_index', { ascending: true })
      .limit(3);

    if (error || !data || data.length === 0) {
      return defaultProjects;
    }
    return data;
  } catch (e) {
    return defaultProjects;
  }
}

async function getTestimonials() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .limit(3);

    if (error || !data || data.length === 0) {
      return defaultTestimonials;
    }
    return data;
  } catch (e) {
    return defaultTestimonials;
  }
}

export default async function Home() {
  const projects = await getFeaturedProjects();
  const testimonials = await getTestimonials();

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroBackground}>
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1920"
            alt="Arquitetura de Luxo"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <span className="section-subtitle fade-in" style={{ color: 'var(--accent-gold)' }}>
            Palloma Duarte Arquitetura
          </span>
          <h1 className={`${styles.heroTitle} fade-in`}>
            Criamos Espaços Autênticos <br />
            Que Contam a Sua História
          </h1>
          <p className={`${styles.heroDesc} fade-in`}>
            Arquitetura e design de interiores de alto padrão. Projetos sofisticados, funcionais e totalmente personalizados para clientes exigentes.
          </p>
          <div className={styles.heroActions}>
            <Link href="/projetos" className="btn-gold">
              Conhecer Portfólio
              <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
            <Link href="#quiz-estilo" className="btn-outline-dark">
              Descobrir Meu Estilo
            </Link>
          </div>
        </div>
      </section>

      {/* Authority / Pillars Section */}
      <section className={styles.pillars}>
        <div className="container">
          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconBox}>
                <Compass size={24} />
              </div>
              <h3>Curadoria Exclusiva</h3>
              <p>Cada detalhe, textura e peça de mobiliário é selecionada sob medida para refletir a sua essência única.</p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconBox}>
                <Shield size={24} />
              </div>
              <h3>Gestão de Obras Sem Estresse</h3>
              <p>Do projeto executivo à entrega das chaves. Cuidamos do cronograma, fornecedores e controle de qualidade.</p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconBox}>
                <Award size={24} />
              </div>
              <h3>Rigores Técnicos</h3>
              <p>Layouts inteligentes, ergonomia de ponta e especificações detalhadas garantindo fidelidade de execução.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className={styles.portfolioSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="section-subtitle">Projetos Selecionados</span>
              <h2 className="section-title">Portfólio em Destaque</h2>
            </div>
            <Link href="/projetos" className={styles.linkUnderline}>
              Ver todos os projetos <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projetos/${project.slug}`}
                className={styles.projectCard}
              >
                <div className={styles.projectImgWrapper}>
                  <img
                    src={project.main_image}
                    alt={project.title}
                    className={styles.projectImg}
                  />
                  <div className={styles.projectOverlay}>
                    <span className={styles.projectCategory}>{project.category}</span>
                  </div>
                </div>
                <div className={styles.projectInfo}>
                  <h3>{project.title}</h3>
                  <p>{project.city} — {project.area}m²</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Transformation */}
      <section className={styles.transformation}>
        <div className="container">
          <div className={styles.transformLayout}>
            <div className={styles.transformText}>
              <span className="section-subtitle">A Arte da Transformação</span>
              <h2 className="section-title">O Poder do Antes & Depois</h2>
              <p className={styles.transformDesc}>
                Arraste o cursor na imagem ao lado para visualizar a evolução completa de um dos nossos principais projetos de reforma de interiores. Veja como convertemos um espaço antigo em uma sala contemporânea sofisticada.
              </p>
              <div className={styles.transformMetrics}>
                <div className={styles.metric}>
                  <strong>+35%</strong>
                  <span>Valorização do Imóvel</span>
                </div>
                <div className={styles.metric}>
                  <strong>100%</strong>
                  <span>Aproveitamento Espacial</span>
                </div>
              </div>
            </div>
            <div className={styles.transformSlider}>
              <BeforeAfter
                beforeImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
                afterImage="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"
                beforeLabel="Antes"
                afterLabel="Depois"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Funnel: Budget Simulator */}
      <BudgetCalculator />

      {/* Interactive Funnel: Style Quiz */}
      <ProjectQuiz />

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className={styles.testimonialsHeader}>
            <span className="section-subtitle">Depoimentos</span>
            <h2 className="section-title">O que dizem nossos clientes</h2>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, idx) => (
              <div key={idx} className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--accent-gold)" stroke="none" />
                  ))}
                </div>
                <p className={styles.testiContent}>&ldquo;{t.content}&rdquo;</p>
                <div className={styles.testiAuthor}>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Conversion Funnel: Meeting Booking */}
      <MeetingScheduler />
    </div>
  );
}
