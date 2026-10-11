import type { Page } from '@/entities/page/types';

import { sortContent } from '@jinho-blog/mdx-handler';

import { contentReader } from '@/core/content';

/**
 * 정적 페이지 목록 (제목순)
 */
export function getPages(): Page[] {
  return sortContent(contentReader.getEntries('pages'), 'alphabetic,asc');
}

/**
 * 단일 정적 페이지 조회
 */
export function getPage(slug: string): Page | null {
  return contentReader.getEntries('pages').find(page => page.slug === slug) ?? null;
}
