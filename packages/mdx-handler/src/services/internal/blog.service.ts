import { ROUTER } from '@jinho-blog/shared';
import type { BlogMetadata, GetBlogPostsOptions, MdxInfo, PaginatedResult } from '@jinho-blog/shared';

import { getRegistry, parseMdxFile, type RegistryEntry } from '../../core';
import { filterByCategory, paginateContentWithMeta, searchContent, sortContent } from '../../utils';

export type Blog = BlogMetadata & MdxInfo & RegistryEntry;

/**
 * 블로그 목록 조회 (필터링, 정렬, 페이지네이션)
 */
export async function getBlogPosts(options?: GetBlogPostsOptions): Promise<PaginatedResult<Blog>> {
  const { category, sort = 'latest', page = 1, count = 12, search } = options || {};

  let posts = getRegistry<Blog>('blog', ROUTER);

  // 1. 카테고리 필터링
  posts = filterByCategory(posts, category);

  // 2. 텍스트 검색
  posts = searchContent(posts, search);

  // 3. 정렬
  posts = sortContent(posts, sort);

  // 4. 페이지네이션
  return paginateContentWithMeta(posts, page, count);
}

/**
 * 단일 블로그 조회
 */
export async function getBlogPost(slug: string): Promise<Blog | null> {
  const registry = getRegistry<Blog>('blog', ROUTER);
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
