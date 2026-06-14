import KanbanCRM from '@/components/KanbanCRM';
import styles from './page.module.css';

export const metadata = {
  title: "CRM Leads | Painel Administrativo",
};

export default function AdminLeadsPage() {
  return (
    <div className={styles.leadsPage}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>CRM & Controle de Leads</h1>
          <p className={styles.subtitle}>Arraste os cards para mover o lead entre as etapas do funil de conversão.</p>
        </div>
      </header>

      <section className={styles.crmSection}>
        <KanbanCRM />
      </section>
    </div>
  );
}
