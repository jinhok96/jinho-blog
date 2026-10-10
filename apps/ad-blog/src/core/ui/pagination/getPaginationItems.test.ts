import { describe, expect, it } from 'vitest';

import { getPaginationItems } from './getPaginationItems';

describe('getPaginationItems', () => {
  it('7페이지 이하 → 전체 표시', () => {
    expect(getPaginationItems(1, 1)).toEqual([1]);
    expect(getPaginationItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('페이지 없음 → 빈 목록', () => {
    expect(getPaginationItems(1, 0)).toEqual([]);
  });

  it('앞쪽 → 뒤쪽만 생략', () => {
    expect(getPaginationItems(1, 12)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 12]);
    expect(getPaginationItems(4, 12)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 12]);
  });

  it('가운데 → 양쪽 생략', () => {
    expect(getPaginationItems(6, 12)).toEqual([1, 'start-ellipsis', 5, 6, 7, 'end-ellipsis', 12]);
  });

  it('뒤쪽 → 앞쪽만 생략', () => {
    expect(getPaginationItems(9, 12)).toEqual([1, 'start-ellipsis', 8, 9, 10, 11, 12]);
    expect(getPaginationItems(12, 12)).toEqual([1, 'start-ellipsis', 8, 9, 10, 11, 12]);
  });

  it('항상 7칸 이하 + 현재 페이지 포함', () => {
    for (let current = 1; current <= 20; current++) {
      const items = getPaginationItems(current, 20);

      expect(items.length).toBeLessThanOrEqual(7);
      expect(items).toContain(current);
    }
  });
});
