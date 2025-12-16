import type { BlogMetadata, GetBlogPostsOptions, MdxInfo, PaginatedResult } from '@jinho-blog/shared';

import { MDX_ROUTES } from '../../core/config';
import {
  getRegistry,
  parseMdxFile,
  type RegistryEntry,
  filterByCategory,
  paginateContentWithMeta,
  searchContent,
  sortContent,
} from '../../core/utils';

export type Blog = BlogMetadata & MdxInfo & RegistryEntry;

/**
 * 블로그 목록 조회 (필터링, 정렬, 페이지네이션)
 */
export async function getBlogPosts(options?: GetBlogPostsOptions): Promise<PaginatedResult<Blog>> {
  const { category, sort, page, count, search } = options || {};

  let data = getRegistry<Blog>('blog', MDX_ROUTES);

  // 1. 카테고리 필터링
  data = filterByCategory(data, category);

  // 2. 텍스트 검색
  data = searchContent<Blog, keyof BlogMetadata>(data, ['title', 'description'], search);

  // 3. 정렬
  data = sortContent(data, sort);

  // 4. 페이지네이션
  return paginateContentWithMeta(data, page, count);
}

/**
 * 단일 블로그 조회
 */
export async function getBlogPost(slug: string): Promise<Blog | null> {
  const registry = getRegistry<Blog>('blog', MDX_ROUTES);
  return registry.find(post => post.slug === slug) || null;
}

/**
 * MDX 콘텐츠 읽기
 */
export async function getBlogContent(slug: string): Promise<string | null> {
  const post = await getBlogPost(slug);
  if (!post) return null;

  const { content } = parseMdxFile(post.filePath);
  return content;
}
