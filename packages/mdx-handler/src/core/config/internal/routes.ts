export type RouteName = 'blog' | 'projects' | 'libraries' | 'translate';

export const MDX_ROUTES: Record<RouteName, string> = {
  blog: '/blog',
  projects: '/projects',
  libraries: '/libraries',
  translate: '/translate',
};
