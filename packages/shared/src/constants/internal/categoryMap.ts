import type { BlogCategory, ProjectCategory, TranslateCategory } from '../../types';

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

export const BLOG_CATEGORIES = Object.keys(BLOG_CATEGORY_MAP) as BlogCategory[];
export const PROJECT_CATEGORIES = Object.keys(PROJECT_CATEGORY_MAP) as ProjectCategory[];

export const TRANSLATE_CATEGORY_MAP: Record<TranslateCategory, string> = {
  // 프레임워크 / 라이브러리
  react: 'React',
  nextjs: 'Next.js',
  // 배포 / 플랫폼
  vercel: 'Vercel',
  // 언어 / 스타일링
  typescript: 'TypeScript',
  tailwindcss: 'Tailwind CSS',
  // 웹 플랫폼
  chrome: 'Chrome',
  webdev: 'web.dev',
  v8: 'V8',
  // AI
  claude: 'Anthropic',
  openai: 'OpenAI',
};
export const TRANSLATE_CATEGORIES = Object.keys(TRANSLATE_CATEGORY_MAP) as TranslateCategory[];
