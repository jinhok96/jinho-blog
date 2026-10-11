/**
 * 정적 export 빈 경로 자리표시 값
 * - 동적 라우트는 페이지에서 해당 값을 찾지 못해 notFound()로 404 렌더링
 */
export const EMPTY_STATIC_PARAM = '_empty';

/**
 * generateStaticParams 결과 보정
 * - `output: 'export'`는 빈 배열을 허용하지 않아 글이 없는 초기 상태에서 빌드가 실패함
 * - 빈 목록이면 모든 키를 EMPTY_STATIC_PARAM으로 채운 경로 하나를 반환
 */
export function withEmptyStaticParam<TKey extends string>(
  params: Record<TKey, string>[],
  keys: readonly TKey[],
): Record<TKey, string>[] {
  if (params.length > 0) return params;

  return [Object.fromEntries(keys.map(key => [key, EMPTY_STATIC_PARAM])) as Record<TKey, string>];
}
