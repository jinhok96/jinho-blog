import { describe, expect, it } from 'vitest';

import { categoryPath, getExtraPageNumbers, paginatedPath, paginatedTitle, parsePageNumber } from './routes';

describe('categoryPath', () => {
  it('카테고리 목록 경로 생성', () => {
    expect(categoryPath('general')).toBe('/categories/general');
  });
});

describe('paginatedPath', () => {
  it('1페이지 이하 → 기본 경로', () => {
    expect(paginatedPath('/', 1)).toBe('/');
    expect(paginatedPath('/categories/general', 1)).toBe('/categories/general');
    expect(paginatedPath('/categories/general', 0)).toBe('/categories/general');
  });

  it('홈 n페이지 → /page/{n}', () => {
    expect(paginatedPath('/', 2)).toBe('/page/2');
  });

  it('카테고리 n페이지 → {base}/page/{n} (끝 슬래시 정리)', () => {
    expect(paginatedPath('/categories/general', 3)).toBe('/categories/general/page/3');
    expect(paginatedPath('/categories/general/', 3)).toBe('/categories/general/page/3');
  });
});

describe('parsePageNumber', () => {
  it('양의 정수 문자열 → 숫자', () => {
    expect(parsePageNumber('1')).toBe(1);
    expect(parsePageNumber('12')).toBe(12);
  });

  it.each(['0', '01', '-1', '1.5', '1e2', ' 2', 'abc', '', '_empty', '99999999999999999999'])(
    '비정규 표기 %j → null',
    value => {
      expect(parsePageNumber(value)).toBeNull();
    },
  );
});

describe('getExtraPageNumbers', () => {
  it('2페이지부터 마지막 페이지까지', () => {
    expect(getExtraPageNumbers(4)).toEqual([2, 3, 4]);
  });

  it('1페이지 이하 → 빈 배열', () => {
    expect(getExtraPageNumbers(1)).toEqual([]);
    expect(getExtraPageNumbers(0)).toEqual([]);
  });
});

describe('paginatedTitle', () => {
  it('1페이지 → 제목 그대로', () => {
    expect(paginatedTitle('일반', 1)).toBe('일반');
  });

  it('2페이지부터 페이지 번호 표시', () => {
    expect(paginatedTitle('전체 글', 2)).toBe('전체 글 (2페이지)');
  });
});
