import type { LibraryCategory } from '@/core/types';
import type { Library } from '@/entities/library/types';

import { getLibraryListByCategory, librariesRegistry } from '@/entities/library/registry.generated';

export async function getLibraries(): Promise<Library[]> {
  return librariesRegistry;
}

export async function getLibrary(slug: string): Promise<Library | null> {
  return librariesRegistry.find(l => l.slug === slug) || null;
}

export async function getLibrariesByCategory(category: LibraryCategory): Promise<Library[]> {
  return getLibraryListByCategory(category);
}
