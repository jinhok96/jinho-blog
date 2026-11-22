import { describe, expect, it } from 'vitest';

import { isOptimizableImageSrc } from './image';

describe('isOptimizableImageSrc', () => {
  it('로컬 경로는 최적화 가능', () => {
    expect(isOptimizableImageSrc('/_static/mdx/blog/a.webp')).toBe(true);
  });

  it('허용된 원격 호스트는 최적화 가능', () => {
    expect(isOptimizableImageSrc('https://developer.chrome.com/static/img.png')).toBe(true);
  });

  it('허용되지 않은 원격 호스트는 최적화 불가', () => {
    expect(isOptimizableImageSrc('https://example.com/img.png')).toBe(false);
  });

  it('허용 호스트의 서브도메인은 최적화 불가', () => {
    expect(isOptimizableImageSrc('https://cdn.web.dev/img.png')).toBe(false);
  });
});
