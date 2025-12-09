import type { GetLibrariesOptions, PaginatedResult } from '@/core/types';
import type { Library } from '@/entities/library/types/types';

import { filterByCategory, paginateContentWithMeta, searchContent, sortContent } from '@/core/utils';

import { librariesRegistry } from '@/entities/library/registry.generated';

export async function getLibraries(options?: GetLibrariesOptions): Promise<PaginatedResult<Library>> {
  const { category, sort = 'latest', page = 1, count = 12, search } = options || {};

  let libraries = librariesRegistry;

  // 1. 카테고리 필터링 (단일 또는 복수)
  libraries = filterByCategory(libraries, category);

  // 2. 텍스트 검색
  libraries = searchContent(libraries, search);

  // 3. 정렬
  libraries = sortContent(libraries, sort);

  // 4. 페이지네이션 with metadata
  return paginateContentWithMeta(libraries, page, count);
}

export async function getLibrary(slug: string): Promise<Library | null> {
  return librariesRegistry.find(l => l.slug === slug) || null;
}
