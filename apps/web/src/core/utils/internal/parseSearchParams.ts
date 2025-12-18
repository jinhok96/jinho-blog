function getFirstValue(value: string | string[] | undefined): string | undefined {
  const str = Array.isArray(value) ? value[0].trim() : value?.trim();
  if (!str) return;
  return str;
}

/**
 * Comma-separated 문자열을 배열로 파싱
 */
function parseString<T extends string>(value: string | string[] | undefined): T | undefined {
  const str = getFirstValue(value);
  if (!str) return;
  return str as T;
}

/**
 * 숫자형 파라미터 파싱
 */
function parseNumeric(value: string | string[] | undefined): number | undefined {
  const str = getFirstValue(value);
  if (!str) return;

  const num = parseInt(str, 10);
  if (isNaN(num)) return;

  return num;
}

/**
 * 콤마로 구분된 문자열을 배열로 파싱
 * ?search=react,typescript 형식 지원
 */
export function parseCommaString(value: string | string[] | undefined): string[] | undefined {
  const str = getFirstValue(value);
  if (!str) return;

  const values = str
    .split(',')
    .map(v => v.trim())
    .filter(v => v !== '');

  if (Array.isArray(values) && values.length === 0) return;
  return values;
}

/**
 * 통합 파싱 함수 (모든 페이지에서 사용)
 */
export const parseSearchParams = {
  category: <T extends string>(category: string | string[] | undefined): T | undefined => parseString<T>(category),

  sort: <T extends string>(sort: string | string[] | undefined): T | undefined => parseString<T>(sort),

  tech: <T extends string>(tech: string | string[] | undefined): T | undefined => parseString<T>(tech),

  page: (page: string | string[] | undefined): number | undefined => parseNumeric(page),

  count: (count: string | string[] | undefined): number | undefined => parseNumeric(count),

  search: (search: string | string[] | undefined): string[] | undefined => parseCommaString(search),
};
