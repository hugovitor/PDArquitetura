'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Users, Grid, FileText, Settings, LogOut, Loader2, MessageSquare, BarChart3 } from 'lucide-react';
import styles from './layout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip session check for login page
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        // Not logged in, redirect to login
        router.push('/admin/login');
      } else {
        setSession(currentSession);
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <Loader2 size={40} className={styles.spinner} />
        <p>Carregando Painel Administrativo...</p>
      </div>
    );
  }

  // If on login page, don't show the sidebar navigation
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'CRM & Leads', href: '/admin/leads', icon: <Users size={18} /> },
    { label: 'Métricas & Acessos', href: '/admin/metricas', icon: <BarChart3 size={18} /> },
    { label: 'Gerenciar Projetos', href: '/admin/projetos', icon: <Grid size={18} /> },
    { label: 'Gerenciar Blog', href: '/admin/blog', icon: <FileText size={18} /> },
    { label: 'Depoimentos', href: '/admin/depoimentos', icon: <MessageSquare size={18} /> }
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logoBox}>
          <strong className={styles.logoTitle}>PD Arquitetura</strong>
          <span className={styles.logoSubtitle}>Painel de Controle</span>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{session?.user?.email}</span>
          </div>
          <button onClick={handleSignOut} className={styles.signOutBtn}>
            <LogOut size={16} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className={styles.content}>
        <div className={styles.scrollContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}
