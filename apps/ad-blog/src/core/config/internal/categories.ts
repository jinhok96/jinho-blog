/**
 * 카테고리 정의 (slug → 표시 정보)
 * - slug는 URL(`/categories/{slug}`)과 글 frontmatter `category`에 사용 (영문 소문자·숫자·하이픈)
 * - description은 카테고리 페이지 메타 설명으로 사용 (페이지마다 고유한 설명이 SEO에 유리)
 * - 주제 확정 시 수정
 */
export const CATEGORY_MAP = {
  general: {
    name: '일반',
    description: '일반 카테고리 글 목록입니다.',
  },
} as const satisfies Record<string, { name: string; description: string }>;

export type Category = keyof typeof CATEGORY_MAP;

export const CATEGORIES = Object.keys(CATEGORY_MAP) as Category[];
