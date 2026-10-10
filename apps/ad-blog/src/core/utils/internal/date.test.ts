import { describe, expect, it } from 'vitest';

import { formatDate, isSameDate } from './date';

describe('formatDate', () => {
  it('한국 시간 기준 날짜로 표시', () => {
    expect(formatDate('2026-01-01T00:00:00.000Z')).toBe('2026년 1월 1일');
  });

  it('UTC로는 전날이어도 한국 시간 기준 날짜 사용', () => {
    expect(formatDate('2025-12-31T16:00:00.000Z')).toBe('2026년 1월 1일');
  });
});

describe('isSameDate', () => {
  it('한국 시간 기준 같은 날이면 true', () => {
    expect(isSameDate('2026-01-01T00:00:00.000Z', '2026-01-01T10:00:00.000Z')).toBe(true);
  });

  it('다른 날이면 false', () => {
    expect(isSameDate('2026-01-01T00:00:00.000Z', '2026-01-02T00:00:00.000Z')).toBe(false);
  });
});
