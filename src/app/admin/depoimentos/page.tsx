'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Edit, Trash2, Check, X, MessageSquare, Star, Sparkles } from 'lucide-react';
import styles from './page.module.css';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
  created_at: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTesti, setEditingTesti] = useState<Testimonial | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [avatar, setAvatar] = useState('');
  const [rating, setRating] = useState(5);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTestimonials(data);
    } catch (e) {
      console.error('Erro ao buscar depoimentos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenNewForm = () => {
    setEditingTesti(null);
    setName('');
    setRole('');
    setContent('');
    setAvatar('');
    setRating(5);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (t: Testimonial) => {
    setEditingTesti(t);
    setName(t.name);
    setRole(t.role);
    setContent(t.content);
    setAvatar(t.avatar || '');
    setRating(t.rating);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !content) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const payload = {
      name,
      role,
      content,
      avatar: avatar || null,
      rating: Number(rating)
    };

    try {
      if (editingTesti) {
        // Update
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingTesti.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('testimonials')
          .insert([payload]);

        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      console.error('Erro ao salvar depoimento:', err);
      alert('Erro ao salvar: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este depoimento?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar depoimento:', err);
      alert('Erro ao excluir: ' + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Depoimentos de Clientes</h1>
          <p className={styles.subtitle}>Gerencie o feedback dos clientes para exibir provas sociais reais na página inicial.</p>
        </div>
        {!isFormOpen && (
          <button onClick={handleOpenNewForm} className="btn-gold">
            <PlusCircle size={16} style={{ marginRight: '8px' }} />
            Adicionar Feedback
          </button>
        )}
      </header>

      {isFormOpen ? (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>{editingTesti ? 'Editar Depoimento' : 'Novo Depoimento'}</h2>
            <button onClick={() => setIsFormOpen(false)} className={styles.closeBtn}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nome do Cliente *</label>
                <input
                  type="text"
                  placeholder="Ex: Carolina Schmidt"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Cargo / Cargo da Obra *</label>
                <input
                  type="text"
                  placeholder="Ex: Proprietária - Penthouse Bela Vista"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Classificação (Estrelas) *</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  <option value="5">5 Estrelas</option>
                  <option value="4">4 Estrelas</option>
                  <option value="3">3 Estrelas</option>
                  <option value="2">2 Estrelas</option>
                  <option value="1">1 Estrela</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Avatar / Foto de Perfil (Link opcional)</label>
                <input
                  type="text"
                  placeholder="URL da foto do cliente"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Conteúdo do Depoimento *</label>
              <textarea
                rows={4}
                placeholder="Escreva aqui o depoimento ou feedback do cliente sobre a experiência com o escritório..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={() => setIsFormOpen(false)} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button type="submit" className="btn-gold">
                Salvar Depoimento
                <Check size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.listCard}>
          {loading ? (
            <div className={styles.loading}>
              <Sparkles size={22} className={styles.spinner} />
              <span>Carregando depoimentos...</span>
            </div>
          ) : testimonials.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Obra / Relação</th>
                    <th>Nota</th>
                    <th>Depoimento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((testi) => (
                    <tr key={testi.id}>
                      <td>
                        <strong>{testi.name}</strong>
                      </td>
                      <td>{testi.role}</td>
                      <td>
                        <div className={styles.stars}>
                          {[...Array(testi.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="var(--accent-gold)" stroke="none" />
                          ))}
                        </div>
                      </td>
                      <td>
                        <p className={styles.testiContentPreview}>{testi.content}</p>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button onClick={() => handleOpenEditForm(testi)} className={styles.editBtn}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(testi.id)} className={styles.deleteBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.empty}>
              <MessageSquare size={32} />
              <p>Nenhum depoimento de cliente adicionado ainda.</p>
              <button onClick={handleOpenNewForm} className="btn-gold" style={{ marginTop: '1rem' }}>
                Adicionar Primeiro Depoimento
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
