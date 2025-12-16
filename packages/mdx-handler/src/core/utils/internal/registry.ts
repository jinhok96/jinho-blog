import type { MDX_ROUTES } from '../../config';

import { parseMdxFile } from './parser';
import { type ContentSection, scanMdxDirectory } from './scanner';

export interface RegistryEntry {
  slug: string;
  filePath: string;
  path: string;
  [key: string]: unknown; // metadata fields
}

// 메모리 캐싱
const registryCache = new Map<ContentSection, RegistryEntry[]>();

/**
 * 레지스트리 생성
 */
export function generateRegistry<T extends RegistryEntry = RegistryEntry>(
  section: ContentSection,
  router: typeof MDX_ROUTES,
): T[] {
  const files = scanMdxDirectory(section);
  const entries: T[] = [];

  for (const file of files) {
    const { metadata } = parseMdxFile(file.filePath);

    entries.push({
      slug: file.slug,
      ...metadata,
      filePath: file.filePath,
      path: `${router[section]}/${file.slug}`,
    } as T);
  }

  return entries;
}

/**
 * 캐시된 레지스트리 가져오기
 */
export function getRegistry<T extends RegistryEntry = RegistryEntry>(
  section: ContentSection,
  router: typeof MDX_ROUTES,
): T[] {
  if (!registryCache.has(section)) {
    const registry = generateRegistry<T>(section, router);
    registryCache.set(section, registry);
  }

  return registryCache.get(section)! as T[];
}

/**
 * 캐시 무효화 (개발 시 유용)
 */
export function clearRegistryCache(section?: ContentSection) {
  if (section) {
    registryCache.delete(section);
  } else {
    registryCache.clear();
  }
}
