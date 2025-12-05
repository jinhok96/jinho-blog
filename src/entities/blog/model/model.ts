import type { GetBlogPostsOptions } from '@/core/types';
import type { Blog } from '@/entities/blog/types/types';

import { filterByCategory, paginateContent, searchContent, sortContent } from '@/core/utils';

import { blogRegistry } from '@/entities/blog/registry.generated';

export async function getBlogPosts(options?: GetBlogPostsOptions): Promise<Blog[]> {
  const { category, sort = 'latest', limit, offset = 0, search } = options || {};

  let posts = blogRegistry;

  // 1. 카테고리 필터링 (단일 또는 복수)
  posts = filterByCategory(posts, category);

  // 2. 텍스트 검색
  posts = searchContent(posts, search);

  // 3. 정렬
  posts = sortContent(posts, sort);

  // 4. 페이지네이션
  posts = paginateContent(posts, limit, offset);

  return posts;
}

export async function getBlogPost(slug: string): Promise<Blog | null> {
  return blogRegistry.find(post => post.slug === slug) || null;
}
