'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Eye } from 'lucide-react';
import styles from './BlogList.module.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  main_image: string;
  published_at: string;
  category: string;
  views: number;
}

interface BlogListProps {
  initialPosts: BlogPost[];
}

const categories = [
  { value: 'all', label: 'Todos' },
  { value: 'tendencias', label: 'Tendências' },
  { value: 'dicas-de-reforma', label: 'Dicas de Reforma' },
  { value: 'estilo-de-vida', label: 'Estilo de Vida' },
  { value: 'arquitetura', label: 'Arquitetura' }
];

export default function BlogList({ initialPosts }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts = activeCategory === 'all'
    ? initialPosts
    : initialPosts.filter(post => post.category.toLowerCase() === activeCategory);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.wrapper}>
      {/* Categories Bar */}
      <div className={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`${styles.catBtn} ${activeCategory === cat.value ? styles.active : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className={styles.grid}>
          {filteredPosts.map((post) => (
            <article key={post.id} className={styles.card}>
              <Link href={`/blog/${post.slug}`} className={styles.imgLink}>
                <div className={styles.imgWrapper}>
                  <img
                    src={post.main_image}
                    alt={post.title}
                    className={styles.img}
                  />
                  <span className={styles.catBadge}>{post.category}</span>
                </div>
              </Link>

              <div className={styles.body}>
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <Calendar size={14} />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Eye size={14} />
                    <span>{post.views} visualizações</span>
                  </div>
                </div>

                <h3 className={styles.title}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className={styles.summary}>{post.summary}</p>

                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  Ler Artigo Completo &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>Nenhum artigo encontrado nesta categoria no momento.</p>
        </div>
      )}
    </div>
  );
}
