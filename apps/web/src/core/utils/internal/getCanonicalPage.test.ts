import { describe, expect, it } from 'vitest';

import { getCanonicalPage } from './getCanonicalPage';

describe('getCanonicalPage', () => {
  it('쿼리가 없으면 undefined 반환', () => {
    expect(getCanonicalPage({})).toBeUndefined();
  });

  it('1페이지면 undefined 반환', () => {
    expect(getCanonicalPage({ page: '1' })).toBeUndefined();
  });

  it('2페이지 이상이면 페이지 번호 반환', () => {
    expect(getCanonicalPage({ page: '3' })).toBe('3');
  });

  it('숫자가 아닌 페이지 값이면 undefined 반환', () => {
    expect(getCanonicalPage({ page: 'abc' })).toBeUndefined();
  });

  it('다른 쿼리가 함께 있으면 undefined 반환', () => {
    expect(getCanonicalPage({ page: '2', category: 'frontend' })).toBeUndefined();
    expect(getCanonicalPage({ page: '2', search: ['react'] })).toBeUndefined();
  });

  it('값이 비어있는 쿼리는 무시', () => {
    expect(getCanonicalPage({ page: '2', category: undefined, sort: '', tech: [] })).toBe('2');
  });
});
