import { describe, expect, it } from 'vitest';

import { stringifyURL } from './stringifyURL';

// ---------------------------------------------------------------------------
// stringifyURL
// ---------------------------------------------------------------------------
describe('stringifyURL', () => {
  it('string 입력이면 그대로 반환', () => {
    expect(stringifyURL('/blog')).toBe('/blog');
  });

  it('빈 문자열 입력이면 그대로 반환', () => {
    expect(stringifyURL('')).toBe('');
  });

  it('pathname만 있는 UrlObject', () => {
    expect(stringifyURL({ pathname: '/blog' })).toBe('/blog');
  });

  it('pathname + query가 있는 UrlObject', () => {
    const result = stringifyURL({ pathname: '/blog', query: { page: '2' } });
    expect(result).toBe('/blog?page=2');
  });

  it('pathname + query + hash가 있는 UrlObject', () => {
    const result = stringifyURL({ pathname: '/blog', query: { page: '2' }, hash: '#section' });
    expect(result).toBe('/blog?page=2#section');
  });

  it('모든 필드가 없는 빈 UrlObject이면 빈 문자열 반환', () => {
    expect(stringifyURL({})).toBe('');
  });

  it('query 없이 hash만 있는 UrlObject', () => {
    expect(stringifyURL({ pathname: '/blog', hash: '#intro' })).toBe('/blog#intro');
  });
});
