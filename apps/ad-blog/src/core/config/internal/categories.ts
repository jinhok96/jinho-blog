/**
 * 카테고리 정의 (slug → 표시 정보)
 * - slug는 URL(`/categories/{slug}`)과 글 frontmatter `category`에 사용 (영문 소문자·숫자·하이픈)
 * - description은 카테고리 페이지 메타 설명으로 사용 (페이지마다 고유한 설명이 SEO에 유리)
 */
export const CATEGORY_MAP = {
  'ai-tools': {
    name: 'AI Tools',
    description:
      'Guides to ChatGPT, Gemini, Claude, Copilot and other AI tools: new features, settings, limits, and fixes for common problems.',
  },
  software: {
    name: 'Apps & Software',
    description:
      'How-to guides and fixes for browsers, operating systems, and everyday apps, including the AI features built into them.',
  },
  news: {
    name: 'News & Analysis',
    description:
      'Analysis of the latest tech and AI news for everyday users: what changed, who it affects, what to do now, and our take.',
  },
} as const satisfies Record<string, { name: string; description: string }>;

export type Category = keyof typeof CATEGORY_MAP;

export const CATEGORIES = Object.keys(CATEGORY_MAP) as Category[];
