import type { PaginationInfo } from '@jinho-blog/shared';

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePagination } from './usePagination';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/blog'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

import { usePathname, useSearchParams } from 'next/navigation';

const mockUsePathname = vi.mocked(usePathname);
const mockUseSearchParams = vi.mocked(useSearchParams);

beforeEach(() => {
  mockUsePathname.mockReturnValue('/blog');
  mockUseSearchParams.mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>);
});

function makePagination(overrides: Partial<PaginationInfo> = {}): PaginationInfo {
  const totalPages = overrides.totalPages ?? 10;
  const currentPage = overrides.currentPage ?? 5;
  return {
    currentPage,
    totalPages,
    totalItems: overrides.totalItems ?? totalPages * 10,
    itemsPerPage: overrides.itemsPerPage ?? 10,
    hasNext: overrides.hasNext ?? currentPage < totalPages,
    hasPrev: overrides.hasPrev ?? currentPage > 1,
    nextPage: overrides.nextPage !== undefined ? overrides.nextPage : currentPage < totalPages ? currentPage + 1 : null,
    prevPage: overrides.prevPage !== undefined ? overrides.prevPage : currentPage > 1 ? currentPage - 1 : null,
  };
}

// ---------------------------------------------------------------------------
// getPageNumbers
// ---------------------------------------------------------------------------
describe('getPageNumbers', () => {
  it('현재 페이지가 중간일 때 5개 버튼 반환 (page=5, total=10)', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 5, totalPages: 10 })));
    expect(result.current.getPageNumbers()).toEqual([3, 4, 5, 6, 7]);
  });

  it('시작 근처 (page=1): [1, 2, 3, 4, 5]', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 1, totalPages: 10 })));
    expect(result.current.getPageNumbers()).toEqual([1, 2, 3, 4, 5]);
  });

  it('끝 근처 (page=10, total=10): [6, 7, 8, 9, 10]', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 10, totalPages: 10 })));
    expect(result.current.getPageNumbers()).toEqual([6, 7, 8, 9, 10]);
  });

  it('totalPages < maxPageButtons: 전체 페이지 배열 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 2, totalPages: 3 })));
    expect(result.current.getPageNumbers()).toEqual([1, 2, 3]);
  });

  it('maxPageButtons=1이면 현재 페이지만 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 5, totalPages: 10 })));
    expect(result.current.getPageNumbers(1)).toEqual([5]);
  });

  it('maxPageButtons=3이면 3개 버튼 반환 (page=5, total=10)', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 5, totalPages: 10 })));
    expect(result.current.getPageNumbers(3)).toEqual([4, 5, 6]);
  });

  it('totalPages=1이면 [1] 반환', () => {
    const { result } = renderHook(() =>
      usePagination(
        makePagination({
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
          nextPage: null,
          prevPage: null,
        }),
      ),
    );
    expect(result.current.getPageNumbers()).toEqual([1]);
  });
});

// ---------------------------------------------------------------------------
// getPageHref
// ---------------------------------------------------------------------------
describe('getPageHref', () => {
  it('유효 페이지 번호 → href 문자열 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 1, totalPages: 5 })));
    expect(result.current.getPageHref(3)).toBe('/blog?page=3');
  });

  it('page < 1이면 null 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 1, totalPages: 5 })));
    expect(result.current.getPageHref(0)).toBeNull();
  });

  it('page > totalPages이면 null 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 1, totalPages: 5 })));
    expect(result.current.getPageHref(6)).toBeNull();
  });

  it('page = totalPages이면 유효한 href 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 1, totalPages: 5 })));
    expect(result.current.getPageHref(5)).toBe('/blog?page=5');
  });
});

// ---------------------------------------------------------------------------
// getFirstPageHref / getLastPageHref
// ---------------------------------------------------------------------------
describe('getFirstPageHref / getLastPageHref', () => {
  it('getFirstPageHref: page=1 href 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 3, totalPages: 5 })));
    expect(result.current.getFirstPageHref()).toBe('/blog?page=1');
  });

  it('getLastPageHref: 마지막 페이지 href 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 3, totalPages: 5 })));
    expect(result.current.getLastPageHref()).toBe('/blog?page=5');
  });
});

// ---------------------------------------------------------------------------
// getNextPageHref / getPrevPageHref
// ---------------------------------------------------------------------------
describe('getNextPageHref / getPrevPageHref', () => {
  it('nextPage가 있으면 다음 페이지 href 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 3, totalPages: 5, nextPage: 4 })));
    expect(result.current.getNextPageHref()).toBe('/blog?page=4');
  });

  it('nextPage=null이면 null 반환', () => {
    const { result } = renderHook(() =>
      usePagination(makePagination({ currentPage: 5, totalPages: 5, hasNext: false, nextPage: null })),
    );
    expect(result.current.getNextPageHref()).toBeNull();
  });

  it('prevPage가 있으면 이전 페이지 href 반환', () => {
    const { result } = renderHook(() => usePagination(makePagination({ currentPage: 3, totalPages: 5, prevPage: 2 })));
    expect(result.current.getPrevPageHref()).toBe('/blog?page=2');
  });

  it('prevPage=null이면 null 반환', () => {
    const { result } = renderHook(() =>
      usePagination(makePagination({ currentPage: 1, totalPages: 5, hasPrev: false, prevPage: null })),
    );
    expect(result.current.getPrevPageHref()).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// hasNext / hasPrev 전파
// ---------------------------------------------------------------------------
describe('hasNext / hasPrev 전파', () => {
  it('hasNext=true이면 그대로 반환', () => {
    const { result } = renderHook(() =>
      usePagination(makePagination({ currentPage: 3, totalPages: 5, hasNext: true })),
    );
    expect(result.current.hasNext).toBe(true);
  });

  it('hasNext=false이면 그대로 반환', () => {
    const { result } = renderHook(() =>
      usePagination(makePagination({ currentPage: 5, totalPages: 5, hasNext: false, nextPage: null })),
    );
    expect(result.current.hasNext).toBe(false);
  });

  it('hasPrev=false이면 그대로 반환', () => {
    const { result } = renderHook(() =>
      usePagination(makePagination({ currentPage: 1, totalPages: 5, hasPrev: false, prevPage: null })),
    );
    expect(result.current.hasPrev).toBe(false);
  });
});
