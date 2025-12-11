import type { BaseMetadata, ContentSortOption, PaginatedResult, PaginationInfo } from '@jinho-blog/shared';

/**
 * 콘텐츠 정렬 (공통 함수)
 */
export function sortContent<T extends BaseMetadata>(items: T[], sortOption: ContentSortOption = 'latest'): T[] {
  const sorted = [...items]; // 원본 배열 변경 방지

  switch (sortOption) {
    case 'latest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'updated':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
}

/**
 * 카테고리 필터링 (공통 함수)
 */
export function filterByCategory<T extends { category: string }>(items: T[], category?: string | string[]): T[] {
  if (!category) return items;

  const categories = Array.isArray(category) ? category : [category];
  return items.filter(item => categories.includes(item.category));
}

/**
 * 텍스트 검색 (제목/설명) (공통 함수)
 */
export function searchContent<T extends { title: string; description: string }>(items: T[], search?: string): T[] {
  if (!search) return items;

  const searchLower = search.toLowerCase();
  return items.filter(
    item => item.title.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower),
  );
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
export function paginateContentWithMeta<T>(items: T[], page?: number, itemsPerPage?: number): PaginatedResult<T> {
  // itemsPerPage가 없으면 전체 데이터 반환
  if (itemsPerPage === undefined) {
    return {
      items,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: items.length,
        itemsPerPage: items.length,
        hasNext: false,
        hasPrev: false,
        nextPage: null,
        prevPage: null,
      },
    };
  }

  const pagination = calculatePagination(items.length, page ?? 1, itemsPerPage);
  const startIndex = (pagination.currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    items: items.slice(startIndex, endIndex),
    pagination,
  };
}

/**
 * 페이지네이션 (공통 함수)
 * @deprecated Use paginateContentWithMeta instead
 */
export function paginateContent<T>(items: T[], limit?: number, offset: number = 0): T[] {
  if (limit === undefined) return items;
  return items.slice(offset, offset + limit);
}
