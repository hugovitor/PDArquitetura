import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

export const metadata = {
  title: "Sobre | Palloma Duarte Arquitetura",
  description: "Conheça a arquiteta Palloma Duarte, sua trajetória, filosofia de projeto e compromisso com a excelência de alto padrão.",
};

export default function SobrePage() {
  return (
    <div className={styles.sobrePage}>
      {/* Editorial Header */}
      <section className={styles.hero}>
        <div className="container">
          <span className="section-subtitle">A Arquiteta & O Escritório</span>
          <h1 className={styles.title}>
            Unindo Arte, Técnica <br />e Estilo de Vida
          </h1>
          <p className={styles.subtitle}>
            Acreditamos que a arquitetura deve transcender a estética: criamos refúgios e espaços de trabalho que potencializam a experiência humana.
          </p>
        </div>
      </section>

      {/* Profile Section */}
      <section className={styles.profile}>
        <div className="container">
          <div className={styles.profileGrid}>
            <div className={styles.profileImgCol}>
              <div className={styles.imgContainer}>
                <Image
                  src="/palloma-duarte.jpg"
                  alt="Palloma Duarte - Arquiteta Principal"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.signatureBox}>
                <strong>Palloma Duarte</strong>
                <span>Arquiteta e Urbanista</span>
              </div>
            </div>
            <div className={styles.profileTextCol}>
              <span className="section-subtitle">Filosofia Editorial</span>
              <h2>Espaços que respiram elegância silenciosa</h2>
              <p>
                Graduada em Arquitetura e Urbanismo e pós-graduada em Design de Interiores de Luxo, Palloma Duarte fundou o escritório com a premissa de que o verdadeiro luxo reside na autenticidade, na proporção perfeita e na escolha honesta dos materiais.
              </p>
              <p>
                Longe de modismos passageiros, nosso traço busca a longevidade estética. Combinamos elementos clássicos e contemporâneos de forma equilibrada, proporcionando conforto térmico, visual, acústico e ergonômico.
              </p>

              <div className={styles.pillarsList}>
                <div className={styles.pillarItem}>
                  <CheckCircle2 size={18} className={styles.iconGold} />
                  <div>
                    <strong>Sintonia com o Cliente:</strong>
                    <p>Nossos projetos nascem de uma escuta profunda do cotidiano do cliente.</p>
                  </div>
                </div>
                <div className={styles.pillarItem}>
                  <CheckCircle2 size={18} className={styles.iconGold} />
                  <div>
                    <strong>Detalhamento de Excelência:</strong>
                    <p>Cada junção de piso, encaixe de marcenaria e paginação é desenhada ao milímetro.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers / Authority */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <strong>+80</strong>
              <span>Projetos Entregues</span>
            </div>
            <div className={styles.statItem}>
              <strong>8 Anos</strong>
              <span>De Experiência no Mercado</span>
            </div>
            <div className={styles.statItem}>
              <strong>15 Cidades</strong>
              <span>Com Obras Realizadas</span>
            </div>
            <div className={styles.statItem}>
              <strong>100%</strong>
              <span>De Clientes Satisfeitos</span>
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>Deseja transformar o seu espaço de vida ou trabalho?</h2>
            <p>Converse diretamente com Palloma Duarte e descubra o que a arquitetura de alto padrão pode fazer por você.</p>
            <Link href="/#agendamento" className="btn-gold">
              Agendar Reunião Diagnóstica
              <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
