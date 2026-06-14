'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Edit, Trash2, Check, X, FileText, Sparkles, BookOpen } from 'lucide-react';
import styles from './page.module.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  main_image: string;
  published_at: string;
  category: string;
  seo_title?: string;
  seo_description?: string;
  views: number;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [category, setCategory] = useState('Tendências');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const handleGenerateAIPost = async () => {
    setGeneratingAI(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(`Artigo "${data.post.title}" gerado com sucesso pelo Gemini AI!`);
        fetchPosts();
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar artigo com a IA.');
    } finally {
      setGeneratingAI(false);
    }
  };


  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      if (data) setPosts(data);
    } catch (e) {
      console.error('Erro ao buscar posts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenNewForm = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setMainImage('');
    setCategory('Tendências');
    setSeoTitle('');
    setSeoDescription('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setMainImage(post.main_image);
    setCategory(post.category);
    setSeoTitle(post.seo_title || '');
    setSeoDescription(post.seo_description || '');
    setIsFormOpen(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !mainImage || !summary || !content) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const postPayload = {
      title,
      slug,
      summary,
      content,
      main_image: mainImage,
      category,
      seo_title: seoTitle || title,
      seo_description: seoDescription || summary,
      published_at: editingPost ? editingPost.published_at : new Date().toISOString()
    };

    try {
      if (editingPost) {
        // Update
        const { error } = await supabase
          .from('blog_posts')
          .update(postPayload)
          .eq('id', editingPost.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('blog_posts')
          .insert([postPayload]);

        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchPosts();
    } catch (err: any) {
      console.error('Erro ao salvar post:', err);
      alert('Erro ao salvar post: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este artigo?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar post:', err);
      alert('Erro ao excluir: ' + err.message);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gerenciar Blog</h1>
          <p className={styles.subtitle}>Crie e publique artigos com dicas, inspirações e novidades para atrair tráfego orgânico (SEO).</p>
        </div>
        {!isFormOpen && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleGenerateAIPost} 
              disabled={generatingAI} 
              className="btn-outline"
              style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }}
            >
              {generatingAI ? 'Gerando com IA...' : 'Gerar Artigo com IA'}
            </button>
            <button onClick={handleOpenNewForm} className="btn-gold">
              <PlusCircle size={16} style={{ marginRight: '8px' }} />
              Escrever Artigo
            </button>
          </div>
        )}
      </header>

      {isFormOpen ? (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>{editingPost ? 'Editar Artigo' : 'Escrever Novo Artigo'}</h2>
            <button onClick={() => setIsFormOpen(false)} className={styles.closeBtn}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Título do Artigo *</label>
                <input
                  type="text"
                  placeholder="Ex: Como escolher cores para quarto..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>URL Slug *</label>
                <input
                  type="text"
                  placeholder="Ex: como-escolher-cores-quarto"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Categoria *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Tendências">Tendências</option>
                  <option value="Dicas de Reforma">Dicas de Reforma</option>
                  <option value="Estilo de Vida">Estilo de Vida</option>
                  <option value="Arquitetura">Arquitetura</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Link da Imagem Principal *</label>
                <input
                  type="text"
                  placeholder="URL da imagem em alta resolução"
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Resumo / Descrição Rápida *</label>
              <textarea
                rows={2}
                placeholder="Breve resumo atraente para a listagem (exibido nos cards do blog)..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>Conteúdo Completo (Use parágrafos normais e tópicos com ###) *</label>
              <textarea
                rows={12}
                placeholder="Escreva seu artigo aqui. Use ### para títulos de seção..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            <hr className={styles.divider} />

            <div className={styles.seoSection}>
              <h3>Configuração Avançada de SEO (Metatags Google)</h3>
              <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>Título SEO (Título na busca do Google)</label>
                  <input
                    type="text"
                    placeholder="Se vazio, usa o título do artigo"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Meta Descrição SEO (Resumo no Google)</label>
                  <input
                    type="text"
                    placeholder="Se vazio, usa o resumo do artigo"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={() => setIsFormOpen(false)} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button type="submit" className="btn-gold">
                Publicar Artigo
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
              <span>Buscando artigos do blog...</span>
            </div>
          ) : posts.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Capa</th>
                    <th>Título do Artigo</th>
                    <th>Categoria</th>
                    <th>Leituras</th>
                    <th>Publicado Em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <img src={post.main_image} alt={post.title} className={styles.thumbnail} />
                      </td>
                      <td>
                        <div className={styles.projInfo}>
                          <strong>{post.title}</strong>
                          <span>/blog/{post.slug}</span>
                        </div>
                      </td>
                      <td>{post.category}</td>
                      <td>{post.views}</td>
                      <td>{formatDate(post.published_at)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button onClick={() => handleOpenEditForm(post)} className={styles.editBtn}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className={styles.deleteBtn}>
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
              <BookOpen size={32} />
              <p>Nenhum artigo publicado no blog ainda.</p>
              <button onClick={handleOpenNewForm} className="btn-gold" style={{ marginTop: '1rem' }}>
                Escrever Primeiro Artigo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
