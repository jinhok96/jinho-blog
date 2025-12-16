function getSingleValue(value: string | string[] | undefined): string | undefined {
  const str = Array.isArray(value) ? value[0].trim() : value?.trim();
  if (!str) return;
  return str;
}

/**
 * Comma-separated 문자열을 배열로 파싱
 * ?category=frontend,algorithm 형식 지원
 */
function parseString<T extends string>(value: string | string[] | undefined): T | undefined {
  const str = getSingleValue(value);
  if (!str) return;

  return str as T;
}

/**
 * 숫자형 파라미터 파싱
 */
function parseNumeric(value: string | string[] | undefined): number | undefined {
  const str = getSingleValue(value);
  if (!str) return;

  const num = parseInt(str, 10);
  if (isNaN(num)) return;

  return num;
}

/**
 * 콤마로 구분된 문자열을 배열로 파싱
 * ?search=react,typescript 형식 지원
 */
function parseCommaString(value: string | string[] | undefined): string | string[] | undefined {
  const str = getSingleValue(value);
  if (!str) return;

  const values = str.split(',').map(v => v.trim());
  const filteredValue = values.filter(v => v !== '');

  if (Array.isArray(filteredValue) && filteredValue.length === 0) return;
  return filteredValue;
}

/**
 * 통합 파싱 함수 (모든 페이지에서 사용)
 */
export function parseContentSearchParams<TCategory extends string, TSort extends string>(
  searchParams: Record<string, string | string[] | undefined>,
): {
  category?: TCategory;
  sort?: TSort;
  page?: number;
  count?: number;
  search?: string | string[];
} {
  return {
    category: parseString<TCategory>(searchParams.category),
    sort: parseString<TSort>(searchParams.sort),
    page: parseNumeric(searchParams.page),
    count: parseNumeric(searchParams.count),
    search: parseCommaString(searchParams.search),
  };
}
