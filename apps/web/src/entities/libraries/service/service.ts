import type {
  GetLibraries,
  GetLibrary,
  GetLibraryContent,
  GetLibraryGroupsByCategory,
  Library,
} from '@/entities/libraries/types';
import type {
  GetLibrariesOptions,
  GetLibraryGroupsByCategoryOptions,
  PaginatedResult,
  SortOption,
} from '@jinho-blog/shared';

import {
  filterByCategory,
  filterByTechStack,
  paginateContentWithMeta,
  searchContent,
  sortContent,
} from '@jinho-blog/mdx-handler';

import { contentReader } from '@/core/content';

/**
 * 라이브러리 목록 조회
 */
async function getLibraries(options?: GetLibrariesOptions): Promise<PaginatedResult<Library>> {
  const { category, sort, tech, page, count, search } = options || {};

  let data = contentReader.getEntries('libraries');

  data = filterByCategory(data, category);
  data = filterByTechStack(data, tech);
  data = searchContent(data, ['title', 'description', 'tech'], search);
  data = sortContent(data, sort);

  return paginateContentWithMeta(data, page, count);
}

/**
 * 카테고리별 그룹화된 라이브러리 목록 조회
 * - count: 카테고리당 최대 항목 수 (레지스트리 순서 기준으로 자른 뒤 정렬)
 */
async function getLibraryGroupsByCategory(
  options?: GetLibraryGroupsByCategoryOptions,
): Promise<GetLibraryGroupsByCategory['response']> {
  const count = options?.count ? Number(options.count) : null;

  const data = contentReader.getEntries('libraries');

  const groups = data.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      if (count && acc[item.category].length >= count) return acc;

      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, Library[]>,
  );

  const sort: SortOption = 'alphabetic,asc';

  // 각 카테고리의 배열을 알파벳순으로 정렬
  Object.keys(groups).forEach(category => {
    groups[category] = sortContent(groups[category], sort);
  });

  return groups;
}

/**
 * 단일 라이브러리 조회
 */
async function getLibrary(slug: string): Promise<Library | null> {
  const entries = contentReader.getEntries('libraries');
  return entries.find(library => library.slug === slug) || null;
}

/**
 * MDX 콘텐츠 읽기
 */
async function getLibraryContent(slug: string): Promise<string | null> {
  const library = await getLibrary(slug);
  if (!library || !library.content) return null;

  return library.content;
}

type LibrariesService = () => {
  getLibraries: (search?: GetLibraries['search']) => Promise<GetLibraries['response']>;
  getLibraryGroupsByCategory: (
    search?: GetLibraryGroupsByCategory['search'],
  ) => Promise<GetLibraryGroupsByCategory['response']>;
  getLibrary: (params: GetLibrary['params']) => Promise<GetLibrary['response']>;
  getLibraryContent: (params: GetLibraryContent['params']) => Promise<GetLibraryContent['response']>;
};

export const createLibrariesService: LibrariesService = () => ({
  getLibraries: async search => {
    const response = await getLibraries(search);
    return response;
  },

  getLibraryGroupsByCategory: async search => {
    const response = await getLibraryGroupsByCategory(search);
    return response;
  },

  getLibrary: async params => {
    const response = await getLibrary(params.slug);
    return response;
  },

  getLibraryContent: async params => {
    const response = await getLibraryContent(params.slug);
    return response;
  },
});
