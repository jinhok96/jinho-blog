import type { BaseMetadata, ContentSortOption, PaginatedResult, PaginationInfo } from '@jinho-blog/shared';

import { DEFAULT_COUNT, DEFAULT_PAGE, DEFAULT_SORT } from '../../config';

type CompareFn<T extends BaseMetadata> = (a: T, b: T) => number;

/**
 * 콘텐츠 정렬 (공통 함수)
 * 기본값: 최신순 (latest)
 */
export function sortContent<T extends BaseMetadata>(items: T[], sortOption: ContentSortOption = DEFAULT_SORT): T[] {
  const sorted = [...items]; // 원본 배열 변경 방지

  const sortLatest: CompareFn<T> = (a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };

  const sortOldest: CompareFn<T> = (a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  };

  const sortUpdated: CompareFn<T> = (a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  };

  switch (sortOption) {
    case 'latest':
      return sorted.sort(sortLatest);
    case 'oldest':
      return sorted.sort(sortOldest);
    case 'updated':
      return sorted.sort(sortUpdated);
    default:
      return sorted.sort(sortLatest);
  }
}

/**
 * 카테고리 필터링 (공통 함수)
 */
export function filterByCategory<T extends { category: string }>(items: T[], category?: string): T[] {
  if (!category) return items;

  const categories = Array.isArray(category) ? category : [category];
  return items.filter(item => categories.includes(item.category));
}

/**
 * 텍스트 검색 (공통 함수)
 *
 * search를 콤마(,)로 파싱하여 모든 검색어가 포함된 항목만 반환 (AND 조건)
 *
 * @param items 검색할 항목 배열
 * @param searchKeys 검색에 포함할 키 목록
 * @param search 검색어 (콤마로 구분된 여러 검색어 가능)
 *
 * @example
 * // 모든 속성에서 검색
 * searchContent(items, "example,react")
 *
 * @example
 * // title과 tech만 검색 (날짜, 카테고리 제외)
 * searchContent(items, "example,react", ["title", "tech"])
 */
export function searchContent<T extends Record<string, unknown>, K extends keyof T>(
  items: T[],
  searchKeys: K[],
  search?: string,
): T[] {
  if (!search) return items;

  // 콤마로 파싱하여 배열로 변환
  const searchTerms = search
    .split(',')
    .map(term => term.trim().toLowerCase())
    .filter(term => term.length > 0);

  if (searchTerms.length === 0) return items;

  // 모든 검색어가 지정된 키의 값에 포함되어야 함 (AND 조건)
  return items.filter(item => {
    return searchTerms.every(term => {
      return searchKeys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        } else if (Array.isArray(value)) {
          return value.some(v => v.toString().toLowerCase().includes(term));
        }
        return false;
      });
    });
  });
}

/**
 * 페이지네이션 정보 계산
 */
export function calculatePagination(totalItems: number, page: number = 1, itemsPerPage: number = 12): PaginationInfo {
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
  page: number = DEFAULT_PAGE,
  count: number = DEFAULT_COUNT,
): PaginatedResult<T> {
  // 방어 코드: items가 오류로 undefined인 경우 빈 배열로 처리
  const safeItems = items || [];

  const pagination = calculatePagination(safeItems.length, page ?? 1, count);
  const startIndex = (pagination.currentPage - 1) * count;
  const endIndex = startIndex + count;

  return {
    items: safeItems.slice(startIndex, endIndex),
    pagination,
  };
}
