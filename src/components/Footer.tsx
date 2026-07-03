'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = pathname.startsWith('/admin');

  // Não renderizar footer público nas rotas administrativas
  if (isAdminRoute) return null;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          {/* Col 1: Logo & Brief */}
          <div className={styles.colBrand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMain}>Palloma Duarte</span>
              <span className={styles.logoSub}>ARQUITETURA</span>
            </Link>
            <p className={styles.brandText}>
              Criamos espaços exclusivos que refletem a sua identidade. Arquitetura sofisticada, funcional e atemporal.
            </p>
            <div className={styles.socials}>
              <a 
                href="https://www.instagram.com/pallomaduarte.arq/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className={styles.socialLink}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className={styles.colLinks}>
            <h3 className={styles.colTitle}>Navegação</h3>
            <ul className={styles.linkList}>
              <li><Link href="/">Início</Link></li>
              <li><Link href="/sobre">Sobre a Arquiteta</Link></li>
              <li><Link href="/servicos">Nossos Serviços</Link></li>
              <li><Link href="/projetos">Portfólio de Projetos</Link></li>
              <li><Link href="/blog">Blog & Inspirações</Link></li>
              <li><Link href="/contato">Fale Conosco</Link></li>
            </ul>
          </div>

          {/* Col 3: Contato */}
          <div className={styles.colContact}>
            <h3 className={styles.colTitle}>Contato</h3>
            <ul className={styles.contactList}>
              <li>
                <MapPin size={18} className={styles.contactIcon} />
                <span>Brasília, Vicente Pires DF</span>
              </li>
              <li>
                <Phone size={18} className={styles.contactIcon} />
                <a href="tel:+5561996021524">+55 (61) 99602-1524</a>
              </li>
              <li>
                <Mail size={18} className={styles.contactIcon} />
                <a href="mailto:pallomaduartearquitetura@gmail.com">pallomaduartearquitetura@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Palloma Duarte Arquitetura. Todos os direitos reservados.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/admin" className={styles.adminLink}>Acesso Restrito</Link>
            <button 
              onClick={scrollToTop} 
              className={styles.scrollTopBtn} 
              aria-label="Voltar ao topo"
            >
              Voltar ao topo <ArrowUp size={16} style={{ marginLeft: '6px' }} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
