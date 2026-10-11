/** 빌드 환경 시간대와 무관하게 한국 시간 기준으로 표시 */
const TIME_ZONE = 'Asia/Seoul';

const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/**
 * ISO 날짜 → 표시용 날짜 (예: 2026년 1월 1일)
 */
export function formatDate(isoDate: string): string {
  return DATE_FORMATTER.format(new Date(isoDate));
}

/**
 * 같은 날짜(한국 시간 기준)인지 비교 — 수정일 표시 여부 판단용
 */
export function isSameDate(a: string, b: string): boolean {
  return formatDate(a) === formatDate(b);
}
