import { describe, expect, it } from 'vitest';

import { formatDate, isSameDate } from './date';

describe('formatDate', () => {
  it('영어(미국) 형식으로 표시', () => {
    expect(formatDate('2026-01-01T00:00:00.000Z')).toBe('Jan 1, 2026');
  });

  it('frontmatter 날짜(UTC 자정)를 하루 전으로 바꾸지 않음', () => {
    expect(formatDate('2026-10-11T00:00:00.000Z')).toBe('Oct 11, 2026');
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
