import type { BlogCategory, ContentSortOption, LibraryCategory, ProjectCategory } from '../../types';

const SORT_LIST: ContentSortOption[] = ['latest', 'updated', 'oldest'];

const BLOG_CATEGORY_LIST: BlogCategory[] = ['frontend', 'algorithm', 'cs', 'uiux', 'review'];
const PROJECT_CATEGORY_LIST: ProjectCategory[] = ['tripmoney', 'personal'];
const LIBRARY_CATEGORY_LIST: LibraryCategory[] = ['react', 'nextjs', 'swr', 'motion', 'zustand'];

export function isContentSortOption(value: string | null | undefined): value is ContentSortOption {
  return typeof value === 'string' && (SORT_LIST as string[]).includes(value);
}

export function isBlogCategory(value: string | null | undefined): value is BlogCategory {
  return typeof value === 'string' && (BLOG_CATEGORY_LIST as string[]).includes(value);
}

export function isProjectCategory(value: string | null | undefined): value is ProjectCategory {
  return typeof value === 'string' && (PROJECT_CATEGORY_LIST as string[]).includes(value);
}

export function isLibraryCategory(value: string | null | undefined): value is LibraryCategory {
  return typeof value === 'string' && (LIBRARY_CATEGORY_LIST as string[]).includes(value);
}
