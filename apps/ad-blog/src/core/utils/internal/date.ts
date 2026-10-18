/**
 * frontmatter 날짜는 UTC 기준(날짜만 쓰면 UTC 자정, 시각은 UTC로 작성)이므로 UTC 기준으로 날짜만 표시
 * - 방문자·빌드 환경 시간대(미국 등 UTC-)를 쓰면 하루 전 날짜로 보이는 문제 방지
 */
const TIME_ZONE = 'UTC';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

/**
 * ISO 날짜 → 표시용 날짜 (예: Jan 1, 2026)
 */
export function formatDate(isoDate: string): string {
  return DATE_FORMATTER.format(new Date(isoDate));
}

/**
 * 같은 날짜(UTC 기준)인지 비교 — 수정일 표시 여부 판단용
 */
export function isSameDate(a: string, b: string): boolean {
  return formatDate(a) === formatDate(b);
}
