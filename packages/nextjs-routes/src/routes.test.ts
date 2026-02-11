import { describe, expect, it } from 'vitest';
import { isRouteObject, routes } from './routes.js';

describe('routes()', () => {
  describe('정적 경로', () => {
    it('/ 루트 경로를 반환한다', () => {
      expect(routes({ pathname: '/' as never })).toBe('/');
    });

    it('정적 pathname을 그대로 반환한다', () => {
      expect(routes({ pathname: '/404' as never })).toBe('/404');
    });

    it('중첩 정적 경로를 반환한다', () => {
      expect(routes({ pathname: '/blog/about' as never })).toBe('/blog/about');
    });
  });

  describe('동적 경로', () => {
    it('[slug] 파라미터를 치환한다', () => {
      expect(routes({ pathname: '/blog/[slug]' as never, params: { slug: 'hello' } })).toBe(
        '/blog/hello',
      );
    });

    it('다중 동적 파라미터를 치환한다', () => {
      expect(
        routes({
          pathname: '/[category]/[slug]' as never,
          params: { category: 'tech', slug: 'post' },
        }),
      ).toBe('/tech/post');
    });
  });

  describe('search params', () => {
    it('단일 search 파라미터를 추가한다', () => {
      expect(routes({ pathname: '/blog' as never, search: { page: '1' } })).toBe('/blog?page=1');
    });

    it('복수 search 파라미터를 추가한다', () => {
      const result = routes({ pathname: '/blog' as never, search: { page: '1', sort: 'desc' } });
      expect(result).toBe('/blog?page=1&sort=desc');
    });

    it('undefined search 값은 필터링한다', () => {
      expect(routes({ pathname: '/blog' as never, search: { page: undefined } })).toBe('/blog');
    });

    it('빈 search 객체는 쿼리를 추가하지 않는다', () => {
      expect(routes({ pathname: '/blog' as never, search: {} })).toBe('/blog');
    });
  });

  describe('hash', () => {
    it('hash를 추가한다', () => {
      expect(routes({ pathname: '/blog' as never, hash: 'section-1' })).toBe('/blog#section-1');
    });
  });

  describe('복합', () => {
    it('params + search + hash를 모두 결합한다', () => {
      expect(
        routes({
          pathname: '/blog/[slug]' as never,
          params: { slug: 'hello' },
          search: { page: '1' },
          hash: 'top',
        }),
      ).toBe('/blog/hello?page=1#top');
    });
  });
});

describe('isRouteObject()', () => {
  describe('유효한 RouteObject', () => {
    it('정적 pathname만 있는 경우 true를 반환한다', () => {
      expect(isRouteObject({ pathname: '/blog' })).toBe(true);
    });

    it('params가 있는 경우 true를 반환한다', () => {
      expect(isRouteObject({ pathname: '/blog/[slug]', params: { slug: 'hello' } })).toBe(true);
    });

    it('search 값이 undefined인 경우 true를 반환한다', () => {
      expect(isRouteObject({ pathname: '/blog', search: { page: undefined } })).toBe(true);
    });

    it('search 값이 string[]인 경우 true를 반환한다', () => {
      expect(isRouteObject({ pathname: '/blog', search: { tags: ['a', 'b'] } })).toBe(true);
    });

    it('hash가 있는 경우 true를 반환한다', () => {
      expect(isRouteObject({ pathname: '/blog', hash: 'section' })).toBe(true);
    });

    it('모든 필드가 있는 경우 true를 반환한다', () => {
      expect(
        isRouteObject({
          pathname: '/blog/[slug]',
          params: { slug: 'hello' },
          search: { page: '1' },
          hash: 'top',
        }),
      ).toBe(true);
    });
  });

  describe('유효하지 않은 값', () => {
    it('null이면 false를 반환한다', () => {
      expect(isRouteObject(null)).toBe(false);
    });

    it('undefined이면 false를 반환한다', () => {
      expect(isRouteObject(undefined)).toBe(false);
    });

    it('문자열이면 false를 반환한다', () => {
      expect(isRouteObject('/blog')).toBe(false);
    });

    it('숫자이면 false를 반환한다', () => {
      expect(isRouteObject(123)).toBe(false);
    });

    it('pathname이 없으면 false를 반환한다', () => {
      expect(isRouteObject({})).toBe(false);
    });

    it('pathname이 숫자이면 false를 반환한다', () => {
      expect(isRouteObject({ pathname: 123 })).toBe(false);
    });

    it('허용되지 않는 키가 있으면 false를 반환한다', () => {
      expect(isRouteObject({ pathname: '/', extra: 1 })).toBe(false);
    });

    it('params가 배열이면 false를 반환한다', () => {
      expect(isRouteObject({ pathname: '/', params: ['arr'] })).toBe(false);
    });

    it('params가 null이면 false를 반환한다', () => {
      expect(isRouteObject({ pathname: '/', params: null })).toBe(false);
    });

    it('params 값이 숫자이면 false를 반환한다', () => {
      expect(isRouteObject({ pathname: '/', params: { slug: 123 } })).toBe(false);
    });

    it('search가 배열이면 false를 반환한다', () => {
      expect(isRouteObject({ pathname: '/', search: ['arr'] })).toBe(false);
    });

    it('hash가 숫자이면 false를 반환한다', () => {
      expect(isRouteObject({ pathname: '/', hash: 123 })).toBe(false);
    });
  });
});
