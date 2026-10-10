export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const HEADING_LEVELS: readonly HeadingLevel[] = [1, 2, 3, 4, 5, 6];

/**
 * MDX 본문 제목 단계 → 렌더링 단계
 * - 페이지 제목이 유일한 `<h1>`이므로 본문 `#`만 h2로 렌더링
 * - 본문 소제목은 `##`부터 작성하는 것을 전제로 나머지 단계는 유지
 *   (모든 단계를 낮추면 `<h1>` 다음에 `<h3>`가 와서 제목 순서가 건너뜀)
 */
export function resolveHeadingLevel(level: HeadingLevel): HeadingLevel {
  return level === 1 ? 2 : level;
}
