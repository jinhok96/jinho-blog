'use client';

import type { PaginationInfo } from '@jinho-blog/shared';

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
  const params = useQueryParams<{ page: string }>();

  const getPageHref = (page: number) => {
    if (page < 1 || page > totalPages) return null;
    const nextHref = params.set('page', page.toString()).toHref();
    return nextHref;
  };

  const getNextPageHref = () => {
    if (!nextPage) return null;
    return getPageHref(nextPage);
  };

  const getPrevPageHref = () => {
    if (!prevPage) return null;
    return getPageHref(prevPage);
  };

  const getFirstPageHref = () => getPageHref(1);

  const getLastPageHref = () => getPageHref(totalPages);

  const getPageNumbers = (maxPageButtons: number = 5) => {
    const half = Math.floor(maxPageButtons / 2);

    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

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
