import type { BlogCategory } from '@/core/types';
import type { Blog } from '@/entities/blog/types';

import { blogRegistry, getBlogListByCategory } from '@/entities/blog/registry.generated';

export async function getBlogPosts(): Promise<Blog[]> {
  // 날짜순 정렬 (최신순)
  return blogRegistry.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBlogPost(slug: string): Promise<Blog | null> {
  return blogRegistry.find(post => post.slug === slug) || null;
}

export async function getBlogPostsByCategory(category: BlogCategory): Promise<Blog[]> {
  return getBlogListByCategory(category).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
