'use client';

import { useSyncExternalStore } from 'react';

import { DEFAULT_TIME_ZONE, formatDate } from '@/core/utils';

type Props = {
  /** ISO 날짜 (frontmatter createdAt·updatedAt) */
  dateTime: string;
  className?: string;
};

/** 시간대는 바뀌지 않는 값이라 구독할 변경 이벤트가 없음 */
function subscribe(): () => void {
  return () => {};
}

function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIME_ZONE;
}

function getServerTimeZone(): string {
  return DEFAULT_TIME_ZONE;
}

/**
 * 방문자 시간대 기준 날짜 `<time>`
 * - 정적 HTML·hydration은 UTC 날짜(서버 렌더링과 일치시켜 hydration 불일치 방지), hydration 직후 방문자 시간대로 다시 렌더링
 * - 날짜만 쓴 값은 시간대와 무관하게 그 날짜 그대로 (formatDate)
 */
export function LocalDate({ dateTime, className }: Props) {
  const timeZone = useSyncExternalStore(subscribe, getBrowserTimeZone, getServerTimeZone);

  return (
    <time
      dateTime={dateTime}
      className={className}
    >
      {formatDate(dateTime, timeZone)}
    </time>
  );
}
