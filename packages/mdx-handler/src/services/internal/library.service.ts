import type { GetLibrariesOptions, LibraryMetadata, MdxInfo, PaginatedResult } from '@jinho-blog/shared';

import { ROUTER } from '@jinho-blog/shared';

import { parseMdxFile } from '../../core/internal/parser';
import { getRegistry, type RegistryEntry } from '../../core/internal/registry';
import { filterByCategory, paginateContentWithMeta, searchContent, sortContent } from '../../utils/internal/content';

export type Library = LibraryMetadata & MdxInfo & RegistryEntry;

/**
 * 라이브러리 목록 조회
 */
export async function getLibraries(options?: GetLibrariesOptions): Promise<PaginatedResult<Library>> {
  const { category, sort = 'latest', page = 1, count = 12, search } = options || {};

  let libraries = getRegistry<Library>('libraries', ROUTER);

  libraries = filterByCategory(libraries, category);
  libraries = searchContent(libraries, search);
  libraries = sortContent(libraries, sort);

  return paginateContentWithMeta(libraries, page, count);
}

/**
 * 단일 라이브러리 조회
 */
export async function getLibrary(slug: string): Promise<Library | null> {
  const registry = getRegistry<Library>('libraries', ROUTER);
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
