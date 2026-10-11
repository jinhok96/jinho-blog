import { describe, expect, it } from 'vitest';

import { resolveHeadingLevel } from './heading';

describe('resolveHeadingLevel', () => {
  it('h1 → h2 (페이지 제목만 h1)', () => {
    expect(resolveHeadingLevel(1)).toBe(2);
  });

  it.each([2, 3, 4, 5, 6] as const)('h%i → 그대로 유지 (h1 다음 h2로 이어져 제목 순서가 건너뛰지 않음)', level => {
    expect(resolveHeadingLevel(level)).toBe(level);
  });
});
