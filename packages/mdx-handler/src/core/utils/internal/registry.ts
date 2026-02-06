import type { MDX_ROUTES } from '../../config';

import { parseMdxFile } from './parser';
import { type ContentSection, scanMdxDirectory } from './scanner';

export interface RegistryEntry {
  slug: string;
  filePath: string;
  path: string;
  [key: string]: unknown; // metadata fields
}

/**
 * 레지스트리 생성
 */
export function getRegistry<T extends RegistryEntry = RegistryEntry>(
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
