export type RouterName = 'home' | 'portfolio' | 'blog' | 'projects' | 'libraries';

export const ROUTER: Record<RouterName, string> = {
  home: '/',
  portfolio: '/portfolio',
  blog: '/blog',
  projects: '/projects',
  libraries: '/libraries',
};
