import { describe, expect, it } from 'vitest';

import { EMPTY_STATIC_PARAM, withEmptyStaticParam } from './staticParams';

describe('withEmptyStaticParam', () => {
  it('경로가 있으면 그대로 반환', () => {
    const params = [{ slug: 'a' }, { slug: 'b' }];

    expect(withEmptyStaticParam(params, ['slug'])).toBe(params);
  });

  it('빈 목록이면 모든 키를 자리표시 값으로 채운 경로 하나 반환', () => {
    expect(withEmptyStaticParam([], ['slug'])).toEqual([{ slug: EMPTY_STATIC_PARAM }]);
    expect(withEmptyStaticParam([], ['category', 'page'])).toEqual([
      { category: EMPTY_STATIC_PARAM, page: EMPTY_STATIC_PARAM },
    ]);
  });
});
