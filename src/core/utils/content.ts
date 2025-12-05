import type { BaseMetadata, ContentSortOption } from '@/core/types';

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
 * 페이지네이션 (공통 함수)
 */
export function paginateContent<T>(items: T[], limit?: number, offset: number = 0): T[] {
  if (limit === undefined) return items;
  return items.slice(offset, offset + limit);
}
