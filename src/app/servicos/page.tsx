import Link from 'next/link';
import { LayoutGrid, Home, Building, ShieldCheck, Palette, Layers, Calendar, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

export const metadata = {
  title: "Serviços | Palloma Duarte Arquitetura",
  description: "Explore nossos serviços de arquitetura residencial, comercial, corporativa e clínica de luxo, com acompanhamento ponta a ponta.",
};

const serviceItems = [
  {
    icon: <Home size={32} />,
    title: 'Arquitetura Residencial',
    desc: 'Casas, coberturas e vilas projetadas do zero ou reformadas de forma integral. Focamos no seu estilo de vida, gerando layouts inteligentes com volumetria elegante, sustentabilidade passiva e integração social.',
  },
  {
    icon: <Building size={32} />,
    title: 'Clínicas & Consultórios',
    desc: 'Projetos que unem o rigor das exigências sanitárias (ANVISA) à sofisticação e acolhimento necessários para clínicas de estética, medicina e odontologia de alto padrão.',
  },
  {
    icon: <LayoutGrid size={32} />,
    title: 'Comercial & Corporativo',
    desc: 'Showrooms, escritórios corporativos e lojas conceito desenvolvidos para potencializar as vendas, transmitir a força da marca e garantir bem-estar aos colaboradores.',
  },
  {
    icon: <Palette size={32} />,
    title: 'Design de Interiores & Curadoria',
    desc: 'Especificação técnica e conceitual completa de revestimentos, paletas cromáticas, paginação de gesso/iluminação, marcenaria detalhada e curadoria de mobiliário assinado.',
  }
];

const steps = [
  {
    num: '01',
    title: 'Imersão & Estudo Preliminar',
    desc: 'Entendimento profundo da rotina do cliente, levantamento físico detalhado do espaço e estudo de viabilidade técnica das ideias.',
  },
  {
    num: '02',
    title: 'Anteprojeto & Realismo 3D',
    desc: 'Desenho dos layouts, fluxos e volumetrias. Criação de maquetes 3D realistas para o cliente visualizar exatamente os acabamentos sugeridos.',
  },
  {
    num: '03',
    title: 'Projeto Executivo & Detalhamento',
    desc: 'Desenho de todas as plantas técnicas: elétrica, hidráulica, luminotécnica, paginação de pisos e o memorial descritivo da marcenaria.',
  },
  {
    num: '04',
    title: 'Suporte de Obra & Chaves na Mão',
    desc: 'Cronograma físico-financeiro, visitas periódicas à obra, reuniões de alinhamento com fornecedores e garantia do padrão de qualidade.',
  }
];

export default function ServicosPage() {
  return (
    <div className={styles.servicosPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <span className="section-subtitle">O que realizamos</span>
          <h1 className={styles.title}>Nossos Serviços de Arquitetura</h1>
          <p className={styles.subtitle}>
            Oferecemos soluções integradas desde o primeiro croqui até a produção final. Uma experiência completa e sem atritos para o seu projeto.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.gridSection}>
        <div className="container">
          <div className={styles.servicesGrid}>
            {serviceItems.map((item, idx) => (
              <div key={idx} className={styles.serviceCard}>
                <div className={styles.iconBox}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className={styles.workflow}>
        <div className="container">
          <div className={styles.workflowHeader}>
            <span className="section-subtitle">Metodologia Exclusiva</span>
            <h2>Como Trabalhamos</h2>
            <p>Criamos um processo linear, transparente e planejado para que a execução da sua obra seja uma jornada agradável.</p>
          </div>

          <div className={styles.stepsTimeline}>
            {steps.map((step, idx) => (
              <div key={idx} className={styles.stepCard}>
                <span className={styles.stepNum}>{step.num}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className={styles.trust}>
        <div className="container">
          <div className={styles.trustBox}>
            <ShieldCheck size={40} className={styles.iconGold} />
            <h2>Projetos assegurados do início ao fim</h2>
            <p>Trabalhamos em conjunto com engenheiros e fornecedores homologados para garantir que o projeto seja entregue fielmente ao que foi aprovado em 3D, sem surpresas no orçamento final.</p>
          </div>
        </div>
      </section>

      {/* Final Conversion CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>Pronto para iniciar a transformação do seu imóvel?</h2>
            <p>Use nosso simulador rápido de orçamento ou agende uma reunião para apresentar suas ideias.</p>
            <div className={styles.ctaButtons}>
              <Link href="/#orcamento" className="btn-gold">
                Simular Investimento
                <ChevronRight size={16} />
              </Link>
              <Link href="/#agendamento" className="btn-outline">
                Agendar Reunião
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
