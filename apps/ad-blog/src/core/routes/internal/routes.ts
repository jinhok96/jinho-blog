import type { BreadcrumbItem } from '@/core/seo';

/** 홈 (전체 글 1페이지) */
export const HOME_PATH = '/';

/** 탐색 경로 첫 항목 */
export const HOME_BREADCRUMB: BreadcrumbItem = { name: '홈', path: HOME_PATH };

/**
 * 카테고리 목록 경로 (예: '/categories/general')
 */
export function categoryPath(category: string): string {
  return `/categories/${category}`;
}

/**
 * 목록 페이지 경로
 * - 1페이지는 기본 경로 그대로 사용 (중복 URL 방지: `/page/1` 미생성)
 * - n페이지는 `{basePath}/page/{n}` (홈은 `/page/{n}`)
 */
export function paginatedPath(basePath: string, page: number): string {
  if (page <= 1) return basePath;

  const base = basePath.replace(/\/+$/, '');
  return `${base}/page/${page}`;
}

/**
 * 페이지 번호 파라미터 → 숫자
 * - 1 이상의 정수만 허용, 앞자리 0·부호·소수점 등 비정규 표기는 거부 (`/page/02` 중복 URL 방지)
 */
export function parsePageNumber(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

/**
 * 2페이지부터 마지막 페이지까지 번호 (generateStaticParams용, 1페이지는 기본 경로)
 */
export function getExtraPageNumbers(totalPages: number): number[] {
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => index + 2);
}

/**
 * 목록 n페이지 제목 (2페이지부터 페이지 번호 표시 — 페이지마다 고유한 제목)
 * - 예: ('일반', 2) → '일반 (2페이지)'
 */
export function paginatedTitle(title: string, page: number): string {
  return page > 1 ? `${title} (${page}페이지)` : title;
}
