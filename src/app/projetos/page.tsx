import { supabase } from '@/lib/supabase';
import ProjectList from '@/components/ProjectList';
import styles from './page.module.css';

export const metadata = {
  title: "Portfólio | Palloma Duarte Arquitetura",
  description: "Conheça nossa seleção exclusiva de projetos de alto padrão: residências sofisticadas, clínicas modernas e espaços comerciais e corporativos.",
};

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
    category: 'clinicas_consultorios',
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
  },
  {
    id: '4',
    title: 'Showroom Casa & Conceito',
    slug: 'showroom-casa-conceito',
    category: 'comercial',
    city: 'Porto Alegre',
    area: 310,
    main_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    description: 'Showroom comercial planejado para valorizar a exposição de móveis soltos.'
  },
  {
    id: '5',
    title: 'Escritório de Advocacia ML',
    slug: 'escritorio-advocacia-ml',
    category: 'corporativo',
    city: 'Porto Alegre',
    area: 180,
    main_image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
    description: 'Layout corporativo sóbrio e imponente, com excelente isolamento acústico.'
  }
];

async function getProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultProjects;
    }
    return data;
  } catch (e) {
    return defaultProjects;
  }
}

export default async function ProjetosPage() {
  const projects = await getProjects();

  return (
    <div className={styles.projetosPage}>
      {/* Header */}
      <section className={styles.hero}>
        <div className="container">
          <span className="section-subtitle font-outfit">Portfólio Editorial</span>
          <h1 className={styles.title}>Nossos Projetos</h1>
          <p className={styles.subtitle}>
            Uma coleção de espaços residenciais, comerciais, corporativos e clínicos projetados com sofisticação silenciosa, precisão técnica e curadoria de materiais de luxo.
          </p>
        </div>
      </section>

      {/* Projects List Section */}
      <section className={styles.listSection}>
        <div className="container">
          <ProjectList initialProjects={projects} />
        </div>
      </section>
    </div>
  );
}
