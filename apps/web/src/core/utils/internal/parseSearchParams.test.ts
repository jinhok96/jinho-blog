import { describe, expect, it } from 'vitest';

import { parseCommaString, parseSearchParams } from './parseSearchParams';

// ---------------------------------------------------------------------------
// parseCommaString
// ---------------------------------------------------------------------------
describe('parseCommaString', () => {
  it('undefined이면 undefined 반환', () => {
    expect(parseCommaString(undefined)).toBeUndefined();
  });

  it('빈 문자열이면 undefined 반환', () => {
    expect(parseCommaString('')).toBeUndefined();
  });

  it('단일 값 문자열을 배열로 반환', () => {
    expect(parseCommaString('react')).toEqual(['react']);
  });

  it('쉼표 구분 문자열을 배열로 파싱', () => {
    expect(parseCommaString('react,typescript')).toEqual(['react', 'typescript']);
  });

  it('값 주변 공백을 trim 처리', () => {
    expect(parseCommaString(' react , typescript ')).toEqual(['react', 'typescript']);
  });

  it('빈 항목은 필터링', () => {
    expect(parseCommaString('react,,typescript')).toEqual(['react', 'typescript']);
  });

  it('배열 입력이면 첫 번째 요소만 사용', () => {
    expect(parseCommaString(['react,typescript', 'ignored'])).toEqual(['react', 'typescript']);
  });

  it('쉼표만 있는 문자열이면 undefined 반환', () => {
    expect(parseCommaString(',')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// parseSearchParams.page
// ---------------------------------------------------------------------------
describe('parseSearchParams.page', () => {
  it('undefined이면 undefined 반환', () => {
    expect(parseSearchParams.page(undefined)).toBeUndefined();
  });

  it('숫자 문자열을 number로 파싱', () => {
    expect(parseSearchParams.page('2')).toBe(2);
  });

  it('비숫자 문자열이면 undefined 반환', () => {
    expect(parseSearchParams.page('abc')).toBeUndefined();
  });

  it('배열 입력이면 첫 번째 요소 파싱', () => {
    expect(parseSearchParams.page(['3', '5'])).toBe(3);
  });

  it('소수점 문자열은 parseInt로 정수 파싱', () => {
    expect(parseSearchParams.page('2.7')).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// parseSearchParams.count
// ---------------------------------------------------------------------------
describe('parseSearchParams.count', () => {
  it('undefined이면 undefined 반환', () => {
    expect(parseSearchParams.count(undefined)).toBeUndefined();
  });

  it('숫자 문자열을 number로 파싱', () => {
    expect(parseSearchParams.count('12')).toBe(12);
  });

  it('비숫자이면 undefined 반환', () => {
    expect(parseSearchParams.count('all')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// parseSearchParams.category / sort / tech
// ---------------------------------------------------------------------------
describe('parseSearchParams.category', () => {
  it('undefined이면 undefined 반환', () => {
    expect(parseSearchParams.category(undefined)).toBeUndefined();
  });

  it('문자열 그대로 반환', () => {
    expect(parseSearchParams.category('frontend')).toBe('frontend');
  });

  it('배열이면 첫 번째 요소 반환', () => {
    expect(parseSearchParams.category(['frontend', 'algorithm'])).toBe('frontend');
  });

  it('빈 문자열이면 undefined 반환', () => {
    expect(parseSearchParams.category('')).toBeUndefined();
  });
});

describe('parseSearchParams.sort', () => {
  it('문자열 그대로 반환', () => {
    expect(parseSearchParams.sort('createdAt,desc')).toBe('createdAt,desc');
  });

  it('undefined이면 undefined 반환', () => {
    expect(parseSearchParams.sort(undefined)).toBeUndefined();
  });
});

describe('parseSearchParams.tech', () => {
  it('문자열 그대로 반환', () => {
    expect(parseSearchParams.tech('react')).toBe('react');
  });

  it('undefined이면 undefined 반환', () => {
    expect(parseSearchParams.tech(undefined)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// parseSearchParams.search
// ---------------------------------------------------------------------------
describe('parseSearchParams.search', () => {
  it('undefined이면 undefined 반환', () => {
    expect(parseSearchParams.search(undefined)).toBeUndefined();
  });

  it('단일 검색어를 배열로 반환', () => {
    expect(parseSearchParams.search('react')).toEqual(['react']);
  });

  it('쉼표 구분 검색어를 배열로 파싱', () => {
    expect(parseSearchParams.search('react,typescript')).toEqual(['react', 'typescript']);
  });
});
