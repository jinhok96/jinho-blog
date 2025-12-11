import type { ContentSortOption } from '@jinho-blog/shared';

/**
 * Comma-separated 문자열을 배열로 파싱
 * ?category=frontend,algorithm 형식과 ?category=frontend&category=algorithm 형식 모두 지원
 */
function parseCommaSeparatedString<T extends string>(value: string | string[] | undefined): T[] | undefined {
  if (!value) return undefined;

  // ?category=frontend&category=algorithm 형식 처리
  if (Array.isArray(value)) {
    return value.flatMap(v => v.split(',').map(s => s.trim() as T));
  }

  // ?category=frontend,algorithm 형식 처리
  return value.split(',').map(s => s.trim() as T);
}

/**
 * 숫자형 파라미터 파싱 (limit, offset)
 */
function parseNumeric(value: string | string[] | undefined): number | undefined {
  if (!value) return undefined;

  const str = Array.isArray(value) ? value[0] : value;
  const num = parseInt(str, 10);

  return isNaN(num) ? undefined : num;
}

/**
 * 정렬 옵션 파싱
 */
function parseSort(value: string | string[] | undefined, defaultSort: ContentSortOption = 'latest'): ContentSortOption {
  if (!value) return defaultSort;

  const sort = Array.isArray(value) ? value[0] : value;

  if (sort === 'latest' || sort === 'oldest' || sort === 'updated') {
    return sort;
  }

  return defaultSort;
}

/**
 * 검색어 파싱
 */
function parseSearchString(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

/**
 * 통합 파싱 함수 (모든 페이지에서 사용)
 */
export function parseContentSearchParams<TCategory extends string>(
  searchParams: Record<string, string | string[] | undefined>,
): {
  category?: TCategory[];
  sort?: ContentSortOption;
  page?: number;
  count?: number;
  search?: string;
  limit?: number;
  offset?: number;
} {
  return {
    category: parseCommaSeparatedString<TCategory>(searchParams.category),
    sort: parseSort(searchParams.sort),
    page: parseNumeric(searchParams.page),
    count: parseNumeric(searchParams.count),
    search: parseSearchString(searchParams.search),
    limit: parseNumeric(searchParams.limit),
    offset: parseNumeric(searchParams.offset),
  };
}
