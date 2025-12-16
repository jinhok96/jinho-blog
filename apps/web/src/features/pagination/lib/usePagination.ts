'use client';

import type { PaginationInfo } from '@jinho-blog/shared';

import { useCallback } from 'react';

import { useQueryParams } from '@/core/hooks';

type UsePaginationReturn = {
  currentPage: number;
  getPageHref: (page: number) => string | null;
  getNextPageHref: () => string | null;
  getPrevPageHref: () => string | null;
  getFirstPageHref: () => string | null;
  getLastPageHref: () => string | null;
  hasNext: boolean;
  hasPrev: boolean;
  getPageNumbers: (maxPageButtons?: number) => number[];
};

export function usePagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  nextPage,
  prevPage,
}: PaginationInfo): UsePaginationReturn {
  const params = useQueryParams();

  const getPageHref = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return null;
      const nextHref = params.set('page', page.toString()).toHref();
      return nextHref;
    },
    [totalPages, params],
  );

  const getNextPageHref = useCallback(() => {
    if (!nextPage) return null;
    return getPageHref(nextPage);
  }, [nextPage, getPageHref]);

  const getPrevPageHref = useCallback(() => {
    if (!prevPage) return null;
    return getPageHref(prevPage);
  }, [prevPage, getPageHref]);

  const getFirstPageHref = useCallback(() => getPageHref(1), [getPageHref]);

  const getLastPageHref = useCallback(() => getPageHref(totalPages), [totalPages, getPageHref]);

  const getPageNumbers = useCallback(
    (maxPageButtons: number = 5) => {
      const half = Math.floor(maxPageButtons / 2);

      let start = Math.max(1, currentPage - half);
      const end = Math.min(totalPages, start + maxPageButtons - 1);

      if (end - start + 1 < maxPageButtons) {
        start = Math.max(1, end - maxPageButtons + 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
    [totalPages, currentPage],
  );

  return {
    currentPage,
    getPageHref,
    getNextPageHref,
    getPrevPageHref,
    getFirstPageHref,
    getLastPageHref,
    hasNext,
    hasPrev,
    getPageNumbers,
  };
}
