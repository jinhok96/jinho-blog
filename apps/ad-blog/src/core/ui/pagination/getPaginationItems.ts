export type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

/** 생략 없이 모두 표시하는 최대 페이지 수 (처음·끝 + 현재 ±1 + 생략 2칸 = 7칸) */
const MAX_VISIBLE = 7;

/**
 * 페이지 번호 목록 (항상 7칸 이하, 처음·마지막 페이지와 현재 페이지 주변 표시)
 * - 예: 현재 6 / 전체 12 → [1, …, 5, 6, 7, …, 12]
 */
export function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= MAX_VISIBLE) return Array.from({ length: Math.max(0, totalPages) }, (_, index) => index + 1);

  // 처음·끝 근처에서는 칸 수를 유지하도록 범위를 한쪽으로 확장
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);
  if (currentPage <= 4) {
    start = 2;
    end = 5;
  } else if (currentPage >= totalPages - 3) {
    start = totalPages - 4;
    end = totalPages - 1;
  }

  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return [
    1,
    ...(start > 2 ? (['start-ellipsis'] as const) : []),
    ...middle,
    ...(end < totalPages - 1 ? (['end-ellipsis'] as const) : []),
    totalPages,
  ];
}
