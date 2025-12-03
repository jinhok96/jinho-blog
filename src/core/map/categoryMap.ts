import type { BlogCategory, LibraryCategory, ProjectCategory } from '@/core/types';

export const BLOG_CATEGORY_MAP: Record<BlogCategory, string> = {
  frontend: '프론트엔드',
  algorithm: '알고리즘',
  cs: 'CS',
  uiux: 'UI/UX',
  review: '회고',
};

export const PROJECT_CATEGORY_MAP: Record<ProjectCategory, string> = {
  tripmoney: '트립머니',
  personal: '개인 프로젝트',
};

export const LIBRARY_CATEGORY_MAP: Record<LibraryCategory, string> = {
  react: 'React',
  nextjs: 'Next.js',
  swr: 'SWR',
  motion: 'Motion',
  zustand: 'Zustand',
};
