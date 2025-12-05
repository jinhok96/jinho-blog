import type { GetLibrariesOptions } from '@/core/types/internal';
import type { Library } from '@/entities/library/types/types';

import { filterByCategory, paginateContent, searchContent, sortContent } from '@/core/utils';

import { librariesRegistry } from '@/entities/library/registry.generated';

export async function getLibraries(options?: GetLibrariesOptions): Promise<Library[]> {
  const { category, sort = 'latest', limit, offset = 0, search } = options || {};

  let libraries = librariesRegistry;

  // 1. 카테고리 필터링 (단일 또는 복수)
  libraries = filterByCategory(libraries, category);

  // 2. 텍스트 검색
  libraries = searchContent(libraries, search);

  // 3. 정렬
  libraries = sortContent(libraries, sort);

  // 4. 페이지네이션
  libraries = paginateContent(libraries, limit, offset);

  return libraries;
}

export async function getLibrary(slug: string): Promise<Library | null> {
  return librariesRegistry.find(l => l.slug === slug) || null;
}
