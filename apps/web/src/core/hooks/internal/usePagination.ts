'use client';

import type { PaginationInfo } from '@jinho-blog/shared';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useQueryParams } from '@/core/hooks';

type UsePaginationReturn = {
  currentPage: number;
  goToPage: (page: number) => void;
  next: () => void;
  prev: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
};

export function usePagination(pagination: PaginationInfo): UsePaginationReturn {
  const router = useRouter();
  const params = useQueryParams();

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > pagination.totalPages) return;

      const next = params.set('page', page.toString());
      router.replace(next);
    },
    [pagination.totalPages, params, router],
  );

  const next = useCallback(() => {
    if (pagination.nextPage) goToPage(pagination.nextPage);
  }, [pagination.nextPage, goToPage]);

  const prev = useCallback(() => {
    if (pagination.prevPage) goToPage(pagination.prevPage);
  }, [pagination.prevPage, goToPage]);

  const goToFirst = useCallback(() => goToPage(1), [goToPage]);

  const goToLast = useCallback(() => {
    goToPage(pagination.totalPages);
  }, [pagination.totalPages, goToPage]);

  return {
    currentPage: pagination.currentPage,
    goToPage,
    next,
    prev,
    goToFirst,
    goToLast,
    canGoNext: pagination.hasNext,
    canGoPrev: pagination.hasPrev,
  };
}
