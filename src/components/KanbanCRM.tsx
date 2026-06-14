'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, Calendar, ArrowRight, Trash2, Edit, AlertCircle, FileText, Search, PlusCircle, Check } from 'lucide-react';
import styles from './KanbanCRM.module.css';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  project_type: string;
  area?: number;
  message?: string;
  status: string;
  temperature: string;
  notes?: string;
  source: string;
}

const columns = [
  { id: 'novo', title: 'Novo Lead', color: '#3498db' },
  { id: 'contatado', title: 'Contatado', color: '#f39c12' },
  { id: 'reuniao_agendada', title: 'Reunião Agendada', color: '#9b59b6' },
  { id: 'proposta_enviada', title: 'Proposta Enviada', color: '#e67e22' },
  { id: 'fechado', title: 'Fechado (Ganho)', color: '#2ecc71' },
  { id: 'perdido', title: 'Perdido', color: '#95a5a6' }
];

export default function KanbanCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingStatus, setEditingStatus] = useState('');
  const [editingTemp, setEditingTemp] = useState('');

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setLeads(data);
    } catch (e) {
      console.error('Erro ao buscar leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // HTML5 Drag & Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    // Optimistic Update
    const originalLeads = [...leads];
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao atualizar status do lead:', err);
      setLeads(originalLeads); // Rollback
    }
  };

  const handleOpenDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setEditingNotes(lead.notes || '');
    setEditingStatus(lead.status);
    setEditingTemp(lead.temperature);
  };

  const handleUpdateLeadDetails = async () => {
    if (!selectedLead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({
          notes: editingNotes,
          status: editingStatus,
          temperature: editingTemp
        })
        .eq('id', selectedLead.id);

      if (error) throw error;

      // Update locally
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? {
        ...l,
        notes: editingNotes,
        status: editingStatus,
        temperature: editingTemp
      } : l));

      setSelectedLead(null);
    } catch (err) {
      console.error('Erro ao salvar notas/status:', err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Deseja realmente deletar este lead permanentemente?')) return;

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLeads(prev => prev.filter(l => l.id !== id));
      setSelectedLead(null);
    } catch (err) {
      console.error('Erro ao deletar lead:', err);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search)
  );

  return (
    <div className={styles.crm}>
      {/* Top Search & Filter Bar */}
      <div className={styles.topBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Pesquisar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={fetchLeads} className={styles.refreshBtn}>
          Atualizar Lista
        </button>
      </div>

      {/* Kanban Board columns */}
      <div className={styles.board}>
        {columns.map((col) => {
          const colLeads = filteredLeads.filter(l => l.status === col.id);
          return (
            <div
              key={col.id}
              className={styles.column}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className={styles.columnHeader} style={{ borderTopColor: col.color }}>
                <h3>{col.title}</h3>
                <span className={styles.countBadge}>{colLeads.length}</span>
              </div>

              <div className={styles.cardsContainer}>
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={styles.card}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onClick={() => handleOpenDetails(lead)}
                  >
                    <div className={styles.cardHeader}>
                      <span className={`${styles.tempBadge} ${
                        lead.temperature === 'quente' ? styles.tempHot :
                        lead.temperature === 'morno' ? styles.tempWarm : styles.tempCold
                      }`}>
                        {lead.temperature}
                      </span>
                      <span className={styles.sourceTag}>{lead.source}</span>
                    </div>
                    <strong className={styles.leadName}>{lead.name}</strong>
                    <p className={styles.leadType}>
                      {lead.project_type} {lead.area ? `(${lead.area} m²)` : ''}
                    </p>
                    <div className={styles.cardMeta}>
                      <div className={styles.metaPhone}>
                        <Phone size={12} />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className={styles.emptyColumn}>
                    <span>Solte leads aqui</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Side Modal */}
      {selectedLead && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Detalhes do Lead</h2>
              <button onClick={() => setSelectedLead(null)} className={styles.closeBtn}>
                Fechar
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.detailsGroup}>
                <label>Nome do Cliente</label>
                <strong>{selectedLead.name}</strong>
              </div>

              <div className={styles.detailsGroupGrid}>
                <div className={styles.detailsGroup}>
                  <label>E-mail</label>
                  <a href={`mailto:${selectedLead.email}`}>{selectedLead.email}</a>
                </div>
                <div className={styles.detailsGroup}>
                  <label>WhatsApp</label>
                  <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    {selectedLead.phone}
                  </a>
                </div>
              </div>

              <div className={styles.detailsGroupGrid}>
                <div className={styles.detailsGroup}>
                  <label>Tipo de Projeto</label>
                  <span>{selectedLead.project_type}</span>
                </div>
                <div className={styles.detailsGroup}>
                  <label>Metragem</label>
                  <span>{selectedLead.area ? `${selectedLead.area} m²` : 'Não informado'}</span>
                </div>
              </div>

              <div className={styles.detailsGroup}>
                <label>Mensagem de Entrada</label>
                <p className={styles.messageText}>
                  {selectedLead.message || 'Sem mensagem adicional.'}
                </p>
              </div>

              <div className={styles.detailsGroupGrid}>
                <div className={styles.detailsGroup}>
                  <label>Alterar Temperatura</label>
                  <select value={editingTemp} onChange={(e) => setEditingTemp(e.target.value)}>
                    <option value="frio">Frio</option>
                    <option value="morno">Morno</option>
                    <option value="quente">Quente</option>
                  </select>
                </div>
                <div className={styles.detailsGroup}>
                  <label>Alterar Etapa</label>
                  <select value={editingStatus} onChange={(e) => setEditingStatus(e.target.value)}>
                    {columns.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.detailsGroup}>
                <label>Notas Internas (Histórico de contatos, reuniões, propostas...)</label>
                <textarea
                  rows={6}
                  placeholder="Escreva anotações sobre este lead..."
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLead.id)}
                className={styles.deleteBtn}
              >
                <Trash2 size={16} />
                Deletar Lead
              </button>
              <button
                type="button"
                onClick={handleUpdateLeadDetails}
                className="btn-gold"
              >
                Salvar Alterações
                <Check size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
