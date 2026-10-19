import { describe, expect, it } from 'vitest';

import { formatDate, isSameDate } from './date';

describe('formatDate', () => {
  it('영어(미국) 형식으로 표시', () => {
    expect(formatDate('2026-01-01T00:00:00.000Z')).toBe('Jan 1, 2026');
  });

  it('시간대를 지정하지 않으면 UTC 기준', () => {
    expect(formatDate('2026-10-18T21:40:00.000Z')).toBe('Oct 18, 2026');
  });

  it('시각이 있는 값은 지정한 시간대의 날짜', () => {
    expect(formatDate('2026-10-18T21:40:00.000Z', 'Asia/Seoul')).toBe('Oct 19, 2026');
    expect(formatDate('2026-10-18T03:47:00.000Z', 'America/Los_Angeles')).toBe('Oct 17, 2026');
  });

  it('날짜만 쓴 값(UTC 자정)은 시간대와 무관하게 그 날짜', () => {
    expect(formatDate('2026-10-11T00:00:00.000Z')).toBe('Oct 11, 2026');
    expect(formatDate('2026-10-11T00:00:00.000Z', 'America/Los_Angeles')).toBe('Oct 11, 2026');
    expect(formatDate('2026-10-11T00:00:00.000Z', 'Asia/Seoul')).toBe('Oct 11, 2026');
  });
});

describe('isSameDate', () => {
  it('UTC 기준 같은 날이면 true', () => {
    expect(isSameDate('2026-01-01T00:00:00.000Z', '2026-01-01T10:00:00.000Z')).toBe(true);
  });

  it('다른 날이면 false', () => {
    expect(isSameDate('2026-01-01T00:00:00.000Z', '2026-01-02T00:00:00.000Z')).toBe(false);
  });
});
