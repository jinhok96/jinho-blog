import { describe, expect, it } from 'vitest';

import { getInFeedAdIndex } from './inFeedAd';

describe('getInFeedAdIndex', () => {
  it('카드가 6개보다 많으면 6번째 카드(인덱스 5) 뒤', () => {
    expect(getInFeedAdIndex(7)).toBe(5);
    expect(getInFeedAdIndex(12)).toBe(5);
  });

  it('6개 이하 목록은 광고 없음 (목록 끝 광고 방지)', () => {
    expect(getInFeedAdIndex(6)).toBeNull();
    expect(getInFeedAdIndex(1)).toBeNull();
    expect(getInFeedAdIndex(0)).toBeNull();
  });
});
