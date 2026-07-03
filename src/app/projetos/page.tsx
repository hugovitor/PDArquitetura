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
    title: 'Apartamento Vicente Pires',
    slug: 'apartamento-vicente-pires',
    category: 'residencial',
    city: 'Brasília - DF',
    area: 110,
    main_image: '/projects/res-1.png',
    description: 'Projeto de reforma e interiores com integração fluida da cozinha e área social, marcenaria off-white sob medida e detalhes de painéis ripados de madeira natural.'
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
