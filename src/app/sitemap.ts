import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { siteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/sobre',
    '/servicos',
    '/projetos',
    '/blog',
    '/contato',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  const projectRoutes = await getDynamicRoutes('projects', '/projetos');
  const postRoutes = await getDynamicRoutes('blog_posts', '/blog');

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}

async function getDynamicRoutes(table: string, prefix: string): Promise<MetadataRoute.Sitemap> {
  try {
    const { data, error } = await supabase.from(table).select('slug');
    if (error || !data) return [];
    return data
      .filter((row) => typeof row.slug === 'string' && row.slug.length > 0)
      .map((row) => ({
        url: `${siteUrl}${prefix}/${row.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
  } catch {
    return [];
  }
}
