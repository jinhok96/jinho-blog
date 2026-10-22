import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import { NO_ADS_ATTRIBUTE } from './adsense';
import { NoAds } from './NoAds';

describe('NoAds', () => {
  it('AdSenseScript가 찾는 광고 제외 속성을 숨긴 요소로 렌더링', () => {
    expect(renderToStaticMarkup(<NoAds />)).toBe(`<div ${NO_ADS_ATTRIBUTE}="" hidden=""></div>`);
  });
});
