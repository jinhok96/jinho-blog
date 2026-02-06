import type {
  GetLibrariesOptions,
  GetLibraryGroupsByCategoryOptions,
  LibraryMetadata,
  MdxInfo,
  PaginatedResult,
  SortOption,
} from '@jinho-blog/shared';

import { MDX_ROUTES } from '../../core/config';
import {
  filterByCategory,
  filterByTechStack,
  getRegistry,
  paginateContentWithMeta,
  parseMdxFile,
  type RegistryEntry,
  searchContent,
  sortContent,
} from '../../core/utils';

export type Library = LibraryMetadata & MdxInfo & RegistryEntry;

/**
 * 라이브러리 목록 조회
 */
export async function getLibraries(options?: GetLibrariesOptions): Promise<PaginatedResult<Library>> {
  const { category, sort, tech, page, count, search } = options || {};

  let data = getRegistry<Library>('libraries', MDX_ROUTES);

  data = filterByCategory(data, category);
  data = filterByTechStack(data, tech);
  data = searchContent<Library, keyof LibraryMetadata>(data, ['title', 'description', 'tech'], search);
  data = sortContent(data, sort);

  return paginateContentWithMeta(data, page, count);
}

/**
 * 카테고리별 그룹화된 라이브러리 목록 조회
 */
export async function getLibraryGroupsByCategory(options?: GetLibraryGroupsByCategoryOptions) {
  const count = options?.count ? Number(options.count) : null;

  const data = getRegistry<Library>('libraries', MDX_ROUTES);

  const groups = data.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      if (count && acc[item.category].length >= count) return acc;

      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof data>,
  );

  const sort: SortOption = 'alphabetic,asc';

  // 각 카테고리의 배열을 알파벳순으로 정렬
  Object.keys(groups).forEach(category => {
    sortContent(groups[category], sort);
  });

  return groups;
}

/**
 * 단일 라이브러리 조회
 */
export async function getLibrary(slug: string): Promise<Library | null> {
  const registry = getRegistry<Library>('libraries', MDX_ROUTES);
  return registry.find(library => library.slug === slug) || null;
}

/**
 * MDX 콘텐츠 읽기
 */
export async function getLibraryContent(slug: string): Promise<string | null> {
  const library = await getLibrary(slug);
  if (!library) return null;

  const { content } = parseMdxFile(library.filePath);
  return content;
}
