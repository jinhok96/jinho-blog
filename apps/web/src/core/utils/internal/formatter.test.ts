import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { formatDateToString, formatLocaleStringToNumber, formatNumberToLocaleString } from './formatter';

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// formatNumberToLocaleString
// ---------------------------------------------------------------------------
describe('formatNumberToLocaleString', () => {
  it('정수를 천 단위 구분자 포함 문자열로 변환', () => {
    expect(formatNumberToLocaleString(1000, 0)).toBe('1,000');
  });

  it('쉼표 포함 문자열 입력도 올바르게 변환', () => {
    expect(formatNumberToLocaleString('1,000,000', 0)).toBe('1,000,000');
  });

  it('NaN 입력이면 원본 문자열 반환', () => {
    expect(formatNumberToLocaleString('abc', 0)).toBe('abc');
  });

  it('소수점 maxDigits 적용', () => {
    const result = formatNumberToLocaleString(1234.567, 2);
    // 소수점 2자리까지만 허용 (ko-KR 로케일)
    expect(result).toBe('1,234.57');
  });

  it('음수 변환', () => {
    expect(formatNumberToLocaleString(-1500, 0)).toBe('-1,500');
  });

  it('0 변환', () => {
    expect(formatNumberToLocaleString(0, 0)).toBe('0');
  });

  it('Infinity 입력은 로케일 변환 결과 반환', () => {
    const result = formatNumberToLocaleString(Infinity, 0);
    expect(result).toBe(Infinity.toLocaleString('ko-KR', { maximumFractionDigits: 0 }));
  });
});

// ---------------------------------------------------------------------------
// formatLocaleStringToNumber
// ---------------------------------------------------------------------------
describe('formatLocaleStringToNumber', () => {
  it('빈 문자열이면 0 반환', () => {
    expect(formatLocaleStringToNumber('')).toBe(0);
  });

  it('쉼표 포함 문자열을 숫자로 변환', () => {
    expect(formatLocaleStringToNumber('1,234,567')).toBe(1234567);
  });

  it('쉼표 없는 숫자 문자열 변환', () => {
    expect(formatLocaleStringToNumber('42')).toBe(42);
  });

  it('음수 문자열 변환', () => {
    expect(formatLocaleStringToNumber('-1,000')).toBe(-1000);
  });

  it('숫자로 변환 불가한 문자열은 NaN 반환', () => {
    expect(formatLocaleStringToNumber('abc')).toBeNaN();
  });
});

// ---------------------------------------------------------------------------
// formatDateToString
// ---------------------------------------------------------------------------
describe('formatDateToString', () => {
  it('빈 문자열이면 빈 문자열 반환', () => {
    expect(formatDateToString('')).toBe('');
  });

  it('Date 객체를 ko-KR 형식 문자열로 변환', () => {
    const date = new Date('2024-01-15T00:00:00Z');
    const result = formatDateToString(date);
    // ko-KR 로케일: "2024. 1. 15." 형식
    expect(result).toContain('2024');
    expect(result).toContain('1');
    expect(result).toContain('15');
  });

  it('문자열 날짜를 ko-KR 형식으로 변환', () => {
    const result = formatDateToString('2024-06-20');
    expect(result).toContain('2024');
    expect(result).toContain('6');
    expect(result).toContain('20');
  });

  it('유효하지 않은 날짜 문자열은 Invalid Date 문자열 반환', () => {
    const result = formatDateToString('not-a-date');
    expect(result).toBe(new Date('not-a-date').toLocaleDateString('ko-KR'));
  });
});
