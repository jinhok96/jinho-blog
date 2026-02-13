import type { TechStack } from '@jinho-blog/shared';

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
  'react-hook-form': 'React Hook Form',
  jest: 'Jest',
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

export const TECH_STACK_IMAGE_MAP: Record<TechStack, string> = {
  // 프론트엔드
  html: 'html5.png',
  javascript: 'javascript.png',
  typescript: 'typescript.png',
  react: 'react.png',
  vue: 'vue.png',
  nextjs: 'nextjs.png',
  'react-native': 'react.png', // react native 로고는 react와 동일

  // 스타일
  css: 'css3.png',
  sass: 'sass.png',
  'styled-components': 'styled_components.png',
  tailwindcss: 'tailwindcss.png',

  // 라이브러리
  'tanstack-query': 'tanstack_query.png',
  axios: 'axios.png',
  swr: 'swr.png',
  zustand: 'zustand.png',
  'react-hook-form': 'react_hook_form.png',
  jest: 'jest.png',
  motion: 'motion.png',

  // 번들러, 배포
  webpack: 'webpack.png',
  babel: 'babel.png',
  electron: 'electron.png',
  turbopack: 'turbopack.png',
  vercel: 'vercel.png',
  vite: 'vite.png',

  // 디자인
  figma: 'figma.png',
  illustrator: 'illustrator.png',
  photoshop: 'photoshop.png',
  'in-design': 'in_design.png',
  'after-effects': 'after_effects.png',

  // 협업
  git: 'git.png',
  github: 'github.png',
  slack: 'slack.png',
  trello: 'trello.png',
  jira: 'jira.png',
  notion: 'notion.png',
};
