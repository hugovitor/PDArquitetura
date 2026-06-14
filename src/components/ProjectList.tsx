'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './ProjectList.module.css';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  city: string;
  area: number;
  main_image: string;
  description: string;
}

interface ProjectListProps {
  initialProjects: Project[];
}

const categoryLabels: Record<string, string> = {
  all: 'Todos',
  residencial: 'Residencial',
  comercial: 'Comercial',
  clinicas_consultorios: 'Clínicas',
  corporativo: 'Corporativo'
};

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all'
    ? initialProjects
    : initialProjects.filter(p => p.category === filter);

  return (
    <div className={styles.wrapper}>
      {/* Category Filter Tabs */}
      <div className={styles.filterTabs}>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`${styles.filterBtn} ${filter === key ? styles.active : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className={styles.grid}>
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projetos/${project.slug}`}
              className={styles.card}
            >
              <div className={styles.imgWrapper}>
                <img
                  src={project.main_image}
                  alt={project.title}
                  className={styles.img}
                />
                <div className={styles.overlay}>
                  <span className={styles.categoryBadge}>
                    {categoryLabels[project.category] || project.category}
                  </span>
                </div>
              </div>
              <div className={styles.info}>
                <h3>{project.title}</h3>
                <p>{project.city} — {project.area}m²</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>Nenhum projeto encontrado nesta categoria no momento.</p>
        </div>
      )}
    </div>
  );
}
