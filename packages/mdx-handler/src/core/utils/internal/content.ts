import type { BaseMetadata, PaginatedResult, PaginationInfo } from '@jinho-blog/shared';

import { DEFAULT_COUNT, DEFAULT_PAGE, DEFAULT_SORT } from '../../config';

type CompareFn<T extends BaseMetadata> = (a: T, b: T) => number;

function splitComma(str: string | null | undefined): string[] {
  if (!str) return [];
  return str
    .split(',')
    .map(v => v.trim())
    .filter(v => v !== '');
}

/**
 * 콘텐츠 정렬 (공통 함수)
 * 기본값: 최신순 (latest)
 */
export function sortContent<T extends BaseMetadata>(items: T[], sort: string | null | undefined): T[] {
  const newItems = [...items]; // 원본 배열 변경 방지

  const sortLatest: CompareFn<T> = (a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };

  const sortOldest: CompareFn<T> = (a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  };

  const sortUpdated: CompareFn<T> = (a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  };

  const safeSortOption = sort || DEFAULT_SORT;

  switch (safeSortOption) {
    case 'latest':
      return newItems.sort(sortLatest);
    case 'oldest':
      return newItems.sort(sortOldest);
    case 'updated':
      return newItems.sort(sortUpdated);
    default:
      return [];
  }
}

/**
 * 카테고리 필터링 (공통 함수)
 * OR 조건
 */
export function filterByCategory<T extends { category: string }>(items: T[], category: string | null | undefined): T[] {
  if (!category) return items;

  const categories = splitComma(category);
  return items.filter(item => categories.includes(item.category));
}

/**
 * 기술 스택 필터링 (공통 함수)
 * AND 조건
 */
export function filterByTechStack<T extends { tech: string[] }>(items: T[], tech: string | null | undefined): T[] {
  if (!tech) return items;

  const techs = splitComma(tech);
  return items.filter(item => techs.every(t => item.tech.includes(t)));
}

/**
 * 텍스트 검색 (공통 함수)
 * AND 조건
 *
 * @param items 검색할 항목 배열
 * @param searchKeys 검색에 포함할 키 목록
 * @param search 검색어 (콤마로 구분된 여러 검색어 가능)
 */
export function searchContent<T extends Record<string, unknown>, K extends keyof T>(
  items: T[],
  searchKeys: K[],
  search: string | null | undefined,
): T[] {
  if (!search) return items;

  // 콤마로 파싱하여 배열로 변환
  const searchValues = splitComma(search).map(term => term.toLowerCase());

  if (searchValues.length === 0) return items;

  // 모든 검색어가 지정된 키의 값에 포함되어야 함 (AND 조건)
  return items.filter(item =>
    searchValues.every(term =>
      searchKeys.some(key => {
        const value = item[key];
        if (typeof value === 'string') return value.toLowerCase().includes(term);
        else if (Array.isArray(value)) return value.some(v => v.toString().toLowerCase().includes(term));
        return false;
      }),
    ),
  );
}

/**
 * 페이지네이션 정보 계산
 */
export function calculatePagination(totalItems: number, page: number, itemsPerPage: number): PaginationInfo {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };
}

/**
 * 페이지네이션된 콘텐츠 추출
 */
export function paginateContentWithMeta<T>(
  items: T[],
  page: number | null | undefined,
  count: number | null | undefined,
): PaginatedResult<T> {
  // 방어 코드: items가 오류로 undefined인 경우 빈 배열로 처리
  const safeItems = items || [];
  const safePage = page || DEFAULT_PAGE;
  const safeCount = count || DEFAULT_COUNT;

  const pagination = calculatePagination(safeItems.length, safePage, safeCount);
  const startIndex = (pagination.currentPage - 1) * safeCount;
  const endIndex = startIndex + safeCount;

  return {
    items: safeItems.slice(startIndex, endIndex),
    pagination,
  };
}
