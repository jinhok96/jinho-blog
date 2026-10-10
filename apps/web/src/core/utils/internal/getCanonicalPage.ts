import { parseSearchParams } from './parseSearchParams';

/**
 * 목록 페이지 canonical URL에 포함할 페이지 번호를 계산합니다.
 * - 페이지네이션(`?page=N`)은 페이지마다 콘텐츠가 다르므로 자기 자신을 canonical로 지정 (구글 페이지네이션 가이드)
 * - 1페이지이거나 정렬/필터/검색 등 다른 쿼리가 섞이면 기본 목록을 canonical로 지정하도록 undefined 반환
 */
export function getCanonicalPage(searchParams: Record<string, string | string[] | undefined>): string | undefined {
  const { page, ...rest } = searchParams;

  const pageNumber = parseSearchParams.page(page);
  if (!pageNumber || pageNumber <= 1) return;

  const hasOtherParams = Object.values(rest).some(value => (Array.isArray(value) ? value.length > 0 : !!value));
  if (hasOtherParams) return;

  return pageNumber.toString();
}
