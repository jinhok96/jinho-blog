import type { BlogCategory, LibraryCategory, PortfolioCategory, ProjectCategory } from '@/core/types';

export const BLOG_CATEGORY_MAP: Record<BlogCategory, string> = {
  frontend: '프론트엔드',
  algorithm: '알고리즘',
  cs: 'CS',
  uiux: 'UI/UX',
  review: '회고',
};

export const PORTFOLIO_CATEGORY_MAP: Record<PortfolioCategory, string> = {
  tripmoney: '트립머니',
  personal: '개인 프로젝트',
};

export const PROJECT_CATEGORY_MAP: Record<ProjectCategory, string> = {
  web: '웹',
  mobile: '모바일',
  uiux: 'UI/UX',
};

export const LIBRARY_CATEGORY_MAP: Record<LibraryCategory, string> = {
  react: 'React',
  nextjs: 'Next.js',
  swr: 'SWR',
  motion: 'Framer Motion',
  zustand: 'Zustand',
};
