import type { GetLibrariesOptions, LibraryMetadata, MdxInfo, PaginatedResult } from '@jinho-blog/shared';

import { MDX_ROUTES } from '../../core/config';
import {
  getRegistry,
  type RegistryEntry,
  filterByCategory,
  paginateContentWithMeta,
  searchContent,
  sortContent,
  parseMdxFile,
} from '../../core/utils';

export type Library = LibraryMetadata & MdxInfo & RegistryEntry;

/**
 * 라이브러리 목록 조회
 */
export async function getLibraries(options?: GetLibrariesOptions): Promise<PaginatedResult<Library>> {
  const { category, sort, page, count, search } = options || {};

  let data = getRegistry<Library>('libraries', MDX_ROUTES);

  data = filterByCategory(data, category);
  data = searchContent<Library, keyof LibraryMetadata>(data, ['title', 'description', 'tech'], search);
  data = sortContent(data, sort);

  return paginateContentWithMeta(data, page, count);
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
