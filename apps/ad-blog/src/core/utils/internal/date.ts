/**
 * 정적 HTML(빌드 시점) 표시 기준 시간대
 * - 방문자 시간대는 빌드 시점에 알 수 없으므로 hydration 후 LocalDate가 다시 표시
 */
export const DEFAULT_TIME_ZONE = 'UTC';

/** 시각 없이 날짜만 쓴 frontmatter 값(`createdAt: 2026-10-11`)은 UTC 자정으로 저장됨 */
const DATE_ONLY_SUFFIX = 'T00:00:00.000Z';

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'short', day: 'numeric' });
    formatters.set(timeZone, formatter);
  }

  return formatter;
}

/**
 * ISO 날짜 → 표시용 날짜 (예: Jan 1, 2026)
 * - 시각이 있는 값: timeZone 기준 날짜 (방문자 시간대로 표시할 때는 LocalDate 사용)
 * - 날짜만 쓴 값(UTC 자정): 시간대와 무관하게 그 날짜 그대로 (UTC-인 미국에서 하루 전 날짜가 되는 문제 방지)
 */
export function formatDate(isoDate: string, timeZone: string = DEFAULT_TIME_ZONE): string {
  const zone = isoDate.endsWith(DATE_ONLY_SUFFIX) ? DEFAULT_TIME_ZONE : timeZone;

  return getFormatter(zone).format(new Date(isoDate));
}

/**
 * 같은 날짜(UTC 기준)인지 비교 — 수정일 표시 여부 판단용
 */
export function isSameDate(a: string, b: string): boolean {
  return formatDate(a) === formatDate(b);
}
