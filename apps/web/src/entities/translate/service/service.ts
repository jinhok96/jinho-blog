import type { GetTranslateContent, GetTranslatePost, GetTranslatePosts, Translate } from '@/entities/translate/types';
import type { GetBlogPostsOptions, PaginatedResult } from '@jinho-blog/shared';

import { filterByCategory, paginateContentWithMeta, searchContent, sortContent } from '@jinho-blog/mdx-handler';

import { contentReader } from '@/core/content';

/**
 * 번역 포스트 목록 조회 (필터링, 정렬, 페이지네이션)
 */
async function getTranslatePosts(options?: GetBlogPostsOptions): Promise<PaginatedResult<Translate>> {
  const { category, sort, page, count, search } = options || {};

  let data = contentReader.getEntries('translate');

  data = filterByCategory(data, category);
  data = searchContent(data, ['title', 'description'], search);
  data = sortContent(data, sort);

  return paginateContentWithMeta(data, page, count);
}

/**
 * 단일 번역 포스트 조회
 */
async function getTranslatePost(slug: string): Promise<Translate | null> {
  const entries = contentReader.getEntries('translate');
  return entries.find(post => post.slug === slug) || null;
}

/**
 * MDX 콘텐츠 읽기
 */
async function getTranslateContent(slug: string): Promise<string | null> {
  const post = await getTranslatePost(slug);
  if (!post || !post.content) return null;

  return post.content;
}

type TranslateService = () => {
  getTranslatePosts: (search?: GetTranslatePosts['search']) => Promise<GetTranslatePosts['response']>;
  getTranslatePost: (params: GetTranslatePost['params']) => Promise<GetTranslatePost['response']>;
  getTranslateContent(params: GetTranslateContent['params']): Promise<GetTranslateContent['response']>;
};

export const createTranslateService: TranslateService = () => ({
  getTranslatePosts: async search => {
    const response = await getTranslatePosts(search);
    return response;
  },

  getTranslatePost: async params => {
    const response = await getTranslatePost(params.slug);
    return response;
  },

  getTranslateContent: async params => {
    const response = await getTranslateContent(params.slug);
    return response;
  },
});
