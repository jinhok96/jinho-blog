import { describe, expect, it } from 'vitest';

import { nbsp } from './nbsp';

// ---------------------------------------------------------------------------
// nbsp
// ---------------------------------------------------------------------------
describe('nbsp', () => {
  it('공백을 &nbsp;로 변환', () => {
    expect(nbsp('hello world')).toBe('hello&nbsp;world');
  });

  it('여러 공백 모두 변환', () => {
    expect(nbsp('a b c')).toBe('a&nbsp;b&nbsp;c');
  });

  it('빈 문자열이면 빈 문자열 반환', () => {
    expect(nbsp('')).toBe('');
  });

  it('공백 없는 문자열은 그대로 반환', () => {
    expect(nbsp('nospace')).toBe('nospace');
  });

  it('양끝 공백도 변환', () => {
    expect(nbsp(' hello ')).toBe('&nbsp;hello&nbsp;');
  });
});
