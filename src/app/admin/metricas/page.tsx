'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, Users, MapPin, Globe, Loader2, ArrowLeft, RefreshCw, Smartphone, Laptop } from 'lucide-react';
import styles from './page.module.css';

interface PageView {
  id: string;
  created_at: string;
  url: string;
  referrer: string;
  user_agent: string;
  city: string;
  region: string;
  country: string;
}

export default function MetricasPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PageView[]>([]);
  const [stats, setStats] = useState({
    totalPageviews: 0,
    uniqueVisitors: 0,
    todayPageviews: 0,
  });
  const [topPages, setTopPages] = useState<{ url: string; count: number }[]>([]);
  const [topReferrers, setTopReferrers] = useState<{ referrer: string; count: number }[]>([]);
  const [topLocations, setTopLocations] = useState<{ location: string; count: number }[]>([]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data: views, error } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (views) {
        setData(views);

        // Calculate general statistics
        const total = views.length;

        // Geolocation + User Agent combination as a proxy for unique visitor
        const uniqueSet = new Set(
          views.map((v) => `${v.city}-${v.region}-${v.user_agent.substring(0, 50)}`)
        );
        const unique = uniqueSet.size;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayCount = views.filter((v) => new Date(v.created_at) >= todayStart).length;

        setStats({
          totalPageviews: total,
          uniqueVisitors: unique,
          todayPageviews: todayCount,
        });

        // Top Pages
        const pageCounts: Record<string, number> = {};
        views.forEach((v) => {
          pageCounts[v.url] = (pageCounts[v.url] || 0) + 1;
        });
        const sortedPages = Object.entries(pageCounts)
          .map(([url, count]) => ({ url, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopPages(sortedPages);

        // Top Referrers
        const refCounts: Record<string, number> = {};
        views.forEach((v) => {
          let ref = v.referrer || 'Direto';
          if (ref.includes('instagram.com')) ref = 'Instagram';
          else if (ref.includes('google.com')) ref = 'Google';
          else if (ref.includes('facebook.com')) ref = 'Facebook';
          else if (ref.includes('wa.me') || ref.includes('whatsapp.com')) ref = 'WhatsApp';
          else if (ref !== 'Direto') {
            try {
              const url = new URL(ref);
              ref = url.hostname;
            } catch {
              // use as-is
            }
          }
          refCounts[ref] = (refCounts[ref] || 0) + 1;
        });
        const sortedRefs = Object.entries(refCounts)
          .map(([referrer, count]) => ({ referrer, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopReferrers(sortedRefs);

        // Top Locations
        const locCounts: Record<string, number> = {};
        views.forEach((v) => {
          const loc = v.city && v.region && v.city !== 'Desconhecida'
            ? `${v.city}, ${v.region}`
            : 'Desconhecido';
          locCounts[loc] = (locCounts[loc] || 0) + 1;
        });
        const sortedLocs = Object.entries(locCounts)
          .map(([location, count]) => ({ location, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopLocations(sortedLocs);
      }
    } catch (err) {
      console.error('Error fetching pageviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const formatDevice = (ua: string) => {
    if (/mobile/i.test(ua)) return <span title="Celular"><Smartphone size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Mobile</span>;
    return <span title="Computador"><Laptop size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Desktop</span>;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Métricas de Tráfego</h1>
          <p className={styles.subtitle}>Veja quem está acessando seu site e quais páginas são mais populares, de forma totalmente gratuita.</p>
        </div>
        <button onClick={fetchMetrics} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} /> Atualizar
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Loader2 size={32} className={styles.spinner} />
          <span>Buscando métricas de acesso...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIconBox}>
                <Eye size={22} className={styles.iconGold} />
              </div>
              <div className={styles.statInfo}>
                <span>Visualizações Totais</span>
                <strong>{stats.totalPageviews}</strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconBox}>
                <Users size={22} className={styles.iconGold} />
              </div>
              <div className={styles.statInfo}>
                <span>Visitantes Únicos</span>
                <strong>{stats.uniqueVisitors}</strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconBox}>
                <Globe size={22} className={styles.iconGold} />
              </div>
              <div className={styles.statInfo}>
                <span>Acessos Hoje</span>
                <strong>{stats.todayPageviews}</strong>
              </div>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Left Column: Aggregated stats */}
            <div className={styles.leftCol}>
              {/* Top Pages */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Páginas Mais Visitadas</h3>
                </div>
                <div className={styles.rankingList}>
                  {topPages.length === 0 ? (
                    <p className={styles.emptyText}>Sem dados disponíveis</p>
                  ) : (
                    topPages.map((item, index) => (
                      <div key={index} className={styles.rankingItem}>
                        <span className={styles.rankingRank}>{index + 1}</span>
                        <span className={styles.rankingLabel}>{item.url}</span>
                        <strong className={styles.rankingValue}>{item.count} views</strong>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Referrers */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Canais de Origem (Como chegaram)</h3>
                </div>
                <div className={styles.rankingList}>
                  {topReferrers.length === 0 ? (
                    <p className={styles.emptyText}>Sem dados disponíveis</p>
                  ) : (
                    topReferrers.map((item, index) => (
                      <div key={index} className={styles.rankingItem}>
                        <span className={styles.rankingRank}>{index + 1}</span>
                        <span className={styles.rankingLabel}>{item.referrer}</span>
                        <strong className={styles.rankingValue}>{item.count} cliques</strong>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Locations */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Principais Cidades</h3>
                </div>
                <div className={styles.rankingList}>
                  {topLocations.length === 0 ? (
                    <p className={styles.emptyText}>Sem dados disponíveis</p>
                  ) : (
                    topLocations.map((item, index) => (
                      <div key={index} className={styles.rankingItem}>
                        <span className={styles.rankingRank}>{index + 1}</span>
                        <span className={styles.rankingLabel}>{item.location}</span>
                        <strong className={styles.rankingValue}>{item.count} visitas</strong>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Recent Activity log */}
            <div className={styles.rightCol}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Registro de Acessos Recentes</h3>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Data/Hora</th>
                        <th>Página</th>
                        <th>Origem</th>
                        <th>Dispositivo</th>
                        <th>Localização</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan={5} className={styles.tableEmpty}>
                            Nenhum acesso registrado ainda.
                          </td>
                        </tr>
                      ) : (
                        data.slice(0, 30).map((view) => (
                          <tr key={view.id}>
                            <td>{formatDate(view.created_at)}</td>
                            <td>
                              <span className={styles.urlText}>{view.url}</span>
                            </td>
                            <td>
                              <span className={styles.refText}>{view.referrer ? (view.referrer.length > 30 ? view.referrer.substring(0, 30) + '...' : view.referrer) : 'Direto'}</span>
                            </td>
                            <td>{formatDevice(view.user_agent)}</td>
                            <td>
                              <span className={styles.locText}>
                                <MapPin size={12} className={styles.locIcon} />
                                {view.city !== 'Desconhecida' ? `${view.city} - ${view.region}` : 'Desconhecida'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
