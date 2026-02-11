import { describe, expect, it } from 'vitest';

import { createSearchParams } from './createSearchParams';

// ---------------------------------------------------------------------------
// createSearchParams
// ---------------------------------------------------------------------------
describe('createSearchParams', () => {
  it('단일 쿼리 객체를 URLSearchParams로 변환', () => {
    const result = createSearchParams({ key: 'page', value: '2' });
    expect(result.get('page')).toBe('2');
  });

  it('배열 쿼리 객체를 모두 URLSearchParams에 설정', () => {
    const result = createSearchParams([
      { key: 'page', value: '1' },
      { key: 'category', value: 'frontend' },
    ]);
    expect(result.get('page')).toBe('1');
    expect(result.get('category')).toBe('frontend');
  });

  it('기존 URLSearchParams와 병합', () => {
    const existing = new URLSearchParams('sort=desc');
    const result = createSearchParams({ key: 'page', value: '2' }, existing);
    expect(result.get('sort')).toBe('desc');
    expect(result.get('page')).toBe('2');
  });

  it('기존 문자열 파라미터와 병합', () => {
    const result = createSearchParams({ key: 'page', value: '3' }, 'sort=asc&category=frontend');
    expect(result.get('sort')).toBe('asc');
    expect(result.get('category')).toBe('frontend');
    expect(result.get('page')).toBe('3');
  });

  it('기존 params가 없으면 새 URLSearchParams 생성', () => {
    const result = createSearchParams({ key: 'page', value: '1' });
    expect(result.toString()).toBe('page=1');
  });

  it('기존 같은 키가 있으면 덮어씀', () => {
    const existing = new URLSearchParams('page=1');
    const result = createSearchParams({ key: 'page', value: '5' }, existing);
    expect(result.get('page')).toBe('5');
    expect(result.getAll('page')).toHaveLength(1);
  });
});
