'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Edit, Trash2, Check, X, Grid, Eye, Sparkles } from 'lucide-react';
import styles from './page.module.css';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  city: string;
  area: number;
  year: number;
  main_image: string;
  gallery: string[];
  before_image?: string;
  after_image?: string;
  is_featured: boolean;
  order_index: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('residencial');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState(100);
  const [year, setYear] = useState(new Date().getFullYear());
  const [mainImage, setMainImage] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [orderIndex, setOrderIndex] = useState(0);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setProjects(data);
    } catch (e) {
      console.error('Erro ao buscar projetos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenNewForm = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    setCategory('residencial');
    setDescription('');
    setCity('');
    setArea(100);
    setYear(new Date().getFullYear());
    setMainImage('');
    setGalleryInput('');
    setBeforeImage('');
    setAfterImage('');
    setIsFeatured(false);
    setOrderIndex(0);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setSlug(proj.slug);
    setCategory(proj.category);
    setDescription(proj.description);
    setCity(proj.city);
    setArea(proj.area);
    setYear(proj.year);
    setMainImage(proj.main_image);
    setGalleryInput(proj.gallery.join(', '));
    setBeforeImage(proj.before_image || '');
    setAfterImage(proj.after_image || '');
    setIsFeatured(proj.is_featured);
    setOrderIndex(proj.order_index);
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
    if (!editingProject) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !mainImage || !description || !city) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const parsedGallery = galleryInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');

    const projectPayload = {
      title,
      slug,
      category,
      description,
      city,
      area: Number(area),
      year: Number(year),
      main_image: mainImage,
      gallery: parsedGallery,
      before_image: beforeImage || null,
      after_image: afterImage || null,
      is_featured: isFeatured,
      order_index: Number(orderIndex)
    };

    try {
      if (editingProject) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', editingProject.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('projects')
          .insert([projectPayload]);

        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error('Erro ao salvar projeto:', err);
      alert('Erro ao salvar projeto: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este projeto?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar projeto:', err);
      alert('Erro ao excluir: ' + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gerenciar Portfólio</h1>
          <p className={styles.subtitle}>Crie, edite e organize os projetos que aparecem no seu site.</p>
        </div>
        {!isFormOpen && (
          <button onClick={handleOpenNewForm} className="btn-gold">
            <PlusCircle size={16} style={{ marginRight: '8px' }} />
            Novo Projeto
          </button>
        )}
      </header>

      {isFormOpen ? (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</h2>
            <button onClick={() => setIsFormOpen(false)} className={styles.closeBtn}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Título do Projeto *</label>
                <input
                  type="text"
                  placeholder="Ex: Cobertura Bela Vista"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>URL Slug *</label>
                <input
                  type="text"
                  placeholder="Ex: cobertura-bela-vista"
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
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="clinicas_consultorios">Clínica / Consultório</option>
                  <option value="corporativo">Corporativo</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Cidade / Localização *</label>
                <input
                  type="text"
                  placeholder="Ex: Porto Alegre - RS"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Área Privativa (m²) *</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ano de Conclusão *</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Descrição do Projeto (Conceito) *</label>
              <textarea
                rows={4}
                placeholder="Descreva a narrativa, os materiais nobres e as soluções criadas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>Link da Imagem Principal *</label>
              <input
                type="text"
                placeholder="Ex: https://images.unsplash.com/... (Cole a URL da imagem de alta qualidade)"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Galeria de Imagens (URLs separadas por vírgula)</label>
              <textarea
                rows={2}
                placeholder="Ex: https://img1.com, https://img2.com..."
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
              ></textarea>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Imagem do Antes (Opcional - Transição slider)</label>
                <input
                  type="text"
                  placeholder="URL da foto antes da reforma"
                  value={beforeImage}
                  onChange={(e) => setBeforeImage(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Imagem do Depois (Opcional - Transição slider)</label>
                <input
                  type="text"
                  placeholder="URL da foto depois da reforma"
                  value={afterImage}
                  onChange={(e) => setAfterImage(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.checkboxGroup}>
                <input
                  id="feat-proj"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label htmlFor="feat-proj">Destacar na Página Inicial</label>
              </div>
              <div className={styles.formGroup}>
                <label>Ordem de Exibição (Index)</label>
                <input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={() => setIsFormOpen(false)} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button type="submit" className="btn-gold">
                Salvar Projeto
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
              <span>Carregando projetos...</span>
            </div>
          ) : projects.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Projeto</th>
                    <th>Categoria</th>
                    <th>Destaque</th>
                    <th>Ordem</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => (
                    <tr key={proj.id}>
                      <td>
                        <img src={proj.main_image} alt={proj.title} className={styles.thumbnail} />
                      </td>
                      <td>
                        <div className={styles.projInfo}>
                          <strong>{proj.title}</strong>
                          <span>{proj.city} — {proj.area}m²</span>
                        </div>
                      </td>
                      <td>{proj.category}</td>
                      <td>{proj.is_featured ? 'Sim' : 'Não'}</td>
                      <td>{proj.order_index}</td>
                      <td>
                        <div className={styles.actions}>
                          <button onClick={() => handleOpenEditForm(proj)} className={styles.editBtn}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(proj.id)} className={styles.deleteBtn}>
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
              <Grid size={32} />
              <p>Nenhum projeto cadastrado no banco de dados ainda.</p>
              <button onClick={handleOpenNewForm} className="btn-gold" style={{ marginTop: '1rem' }}>
                Criar Primeiro Projeto
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
