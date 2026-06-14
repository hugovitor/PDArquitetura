'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Users, Calendar, AlertCircle, ArrowRight, Zap, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  project_type: string;
  status: string;
  temperature: string;
  source: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    meetings: 0,
    conversion: 0
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch leads
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (leadsError) throw leadsError;

        // Fetch meetings count
        const { count: meetingsCount, error: meetingsError } = await supabase
          .from('meetings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'confirmed');

        if (meetingsError) throw meetingsError;

        if (leadsData) {
          setLeads(leadsData);

          // Calculate stats
          const total = leadsData.length;
          const hot = leadsData.filter(l => l.temperature === 'quente').length;
          const closed = leadsData.filter(l => l.status === 'fechado').length;
          const conversion = total > 0 ? Math.round((closed / total) * 100) : 0;

          setStats({
            total,
            hot,
            meetings: meetingsCount || 0,
            conversion
          });
        }
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getTemperatureClass = (temp: string) => {
    switch (temp) {
      case 'quente': return styles.tempHot;
      case 'morno': return styles.tempWarm;
      case 'frio': return styles.tempCold;
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      novo: 'Novo',
      contatado: 'Contatado',
      reuniao_agendada: 'Reunião Agendada',
      proposta_enviada: 'Proposta Enviada',
      fechado: 'Fechado',
      perdido: 'Perdido'
    };
    return labels[status] || status;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Sparkles size={24} className={styles.spinner} />
        <span>Buscando métricas e leads...</span>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Painel Geral</h1>
          <p className={styles.subtitle}>Visão consolidada do seu funil e contatos de clientes.</p>
        </div>
        <Link href="/admin/leads" className="btn-gold">
          Ver CRM Kanban
          <ArrowRight size={16} style={{ marginLeft: '8px' }} />
        </Link>
      </header>

      {/* Stats Cards Grid */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconBox} style={{ color: 'var(--accent-gold)' }}>
            <Users size={22} />
          </div>
          <div className={styles.statInfo}>
            <span>Leads Capturados</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBox} style={{ color: '#e74c3c' }}>
            <Zap size={22} />
          </div>
          <div className={styles.statInfo}>
            <span>Qualificados (Quentes)</span>
            <strong>{stats.hot}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBox} style={{ color: '#3498db' }}>
            <Calendar size={22} />
          </div>
          <div className={styles.statInfo}>
            <span>Reuniões Agendadas</span>
            <strong>{stats.meetings}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBox} style={{ color: '#2ecc71' }}>
            <TrendingUp size={22} />
          </div>
          <div className={styles.statInfo}>
            <span>Taxa de Conversão</span>
            <strong>{stats.conversion}%</strong>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className={styles.contentGrid}>
        {/* Recent Leads */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Leads Recentes</h3>
            <Link href="/admin/leads" className={styles.link}>
              Ver todos
            </Link>
          </div>

          {leads.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Origem</th>
                    <th>Temperatura</th>
                    <th>Status</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div className={styles.leadNameBox}>
                          <strong>{lead.name}</strong>
                          <span>{lead.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.sourceBadge}>{lead.source}</span>
                      </td>
                      <td>
                        <span className={`${styles.tempBadge} ${getTemperatureClass(lead.temperature)}`}>
                          {lead.temperature}
                        </span>
                      </td>
                      <td>{getStatusLabel(lead.status)}</td>
                      <td>{formatDate(lead.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.empty}>
              <AlertCircle size={24} style={{ color: 'var(--text-secondary)' }} />
              <p>Nenhum lead capturado no momento. Divulgue seu site e funis!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
