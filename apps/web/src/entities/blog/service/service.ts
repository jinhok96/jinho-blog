import type { Blog, GetBlogContent, GetBlogPost, GetBlogPosts } from '@/entities/blog/types';
import type { GetBlogPostsOptions, PaginatedResult } from '@jinho-blog/shared';

import { filterByCategory, paginateContentWithMeta, searchContent, sortContent } from '@jinho-blog/mdx-handler';

import { contentReader } from '@/core/content';

/**
 * 블로그 목록 조회 (필터링, 정렬, 페이지네이션)
 */
async function getBlogPosts(options?: GetBlogPostsOptions): Promise<PaginatedResult<Blog>> {
  const { category, sort, page, count, search } = options || {};

  let data = contentReader.getEntries('blog');

  data = filterByCategory(data, category);
  data = searchContent(data, ['title', 'description'], search);
  data = sortContent(data, sort);

  return paginateContentWithMeta(data, page, count);
}

/**
 * 단일 블로그 조회
 */
async function getBlogPost(slug: string): Promise<Blog | null> {
  const entries = contentReader.getEntries('blog');
  return entries.find(post => post.slug === slug) || null;
}

/**
 * MDX 콘텐츠 읽기
 */
async function getBlogContent(slug: string): Promise<string | null> {
  const post = await getBlogPost(slug);
  if (!post || !post.content) return null;

  return post.content;
}

type BlogService = () => {
  getBlogPosts: (search?: GetBlogPosts['search']) => Promise<GetBlogPosts['response']>;
  getBlogPost: (params: GetBlogPost['params']) => Promise<GetBlogPost['response']>;
  getBlogContent(params: GetBlogContent['params']): Promise<GetBlogContent['response']>;
};

export const createBlogService: BlogService = () => ({
  getBlogPosts: async search => {
    const response = await getBlogPosts(search);
    return response;
  },

  getBlogPost: async params => {
    const response = await getBlogPost(params.slug);
    return response;
  },

  getBlogContent: async params => {
    const response = await getBlogContent(params.slug);
    return response;
  },
});
