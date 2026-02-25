import type { TechStack } from '../../types';

export const TECH_STACK_MAP: Record<TechStack, string> = {
  // 프론트엔드
  html: 'HTML',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  vue: 'Vue',
  nextjs: 'Next.js',
  'react-native': 'React Native',

  // 스타일
  css: 'CSS',
  sass: 'Sass',
  'styled-components': 'Styled Components',
  tailwindcss: 'TailwindCSS',

  // 라이브러리
  'tanstack-query': 'Tanstack Query',
  axios: 'Axios',
  swr: 'SWR',
  zustand: 'Zustand',
  pinia: 'Pinia',
  'react-hook-form': 'React Hook Form',
  jest: 'Jest',
  vitest: 'Vitest',
  motion: 'Motion',

  // 번들러, 배포
  webpack: 'Webpack',
  babel: 'Babel',
  electron: 'Electron',
  turbopack: 'Turbopack',
  vercel: 'Vercel',
  vite: 'Vite',

  // 디자인
  figma: 'Figma',
  illustrator: 'Illustrator',
  photoshop: 'Photoshop',
  'in-design': 'InDesign',
  'after-effects': 'After Effects',

  // 협업
  git: 'Git',
  github: 'GitHub',
  slack: 'Slack',
  trello: 'Trello',
  jira: 'Jira',
  notion: 'Notion',
};
