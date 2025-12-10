'use client';

import type { PaginationInfo } from '@/core/types';

import { usePagination } from '@/core/hooks';
import { cn } from '@/core/utils';

type Props = {
  className?: string;
  pagination: PaginationInfo;
  showFirstLast?: boolean;
  maxPageButtons?: number;
};

export function Pagination({ className, pagination, showFirstLast = false, maxPageButtons = 5 }: Props) {
  const { currentPage, goToPage, next, prev, goToFirst, goToLast, canGoNext, canGoPrev } = usePagination(pagination);

  if (pagination.totalPages <= 1) return null;

  // 페이지 번호 계산 로직
  const getPageNumbers = () => {
    const { totalPages } = pagination;
    const half = Math.floor(maxPageButtons / 2);

    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();
  const showStartEllipsis = pageNumbers[0] > 1;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < pagination.totalPages;

  return (
    <div className={cn('flex-row-center gap-2', className)}>
      {showFirstLast && (
        <button
          onClick={goToFirst}
          disabled={!canGoPrev}
          className={`
            rounded-md border border-gray-300 px-3 py-1.5 text-sm transition-colors
            hover:bg-gray-100
            disabled:cursor-not-allowed disabled:opacity-50
            dark:border-gray-700 dark:hover:bg-gray-800
          `}
        >
          처음
        </button>
      )}

      <button
        onClick={prev}
        disabled={!canGoPrev}
        className={`
          rounded-md border border-gray-300 px-3 py-1.5 text-sm transition-colors
          hover:bg-gray-100
          disabled:cursor-not-allowed disabled:opacity-50
          dark:border-gray-700 dark:hover:bg-gray-800
        `}
      >
        이전
      </button>

      {showStartEllipsis && (
        <>
          <button
            onClick={() => goToPage(1)}
            className={`
              rounded-md px-3 py-1.5 text-sm transition-colors
              hover:bg-gray-100
              dark:hover:bg-gray-800
            `}
          >
            1
          </button>
          <span className="px-1 text-gray-400">...</span>
        </>
      )}

      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          disabled={page === currentPage}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800',
            page === currentPage && 'cursor-default',
          )}
        >
          {page}
        </button>
      ))}

      {showEndEllipsis && (
        <>
          <span className="px-1 text-gray-400">...</span>
          <button
            onClick={() => goToPage(pagination.totalPages)}
            className={`
              rounded-md px-3 py-1.5 text-sm transition-colors
              hover:bg-gray-100
              dark:hover:bg-gray-800
            `}
          >
            {pagination.totalPages}
          </button>
        </>
      )}

      <button
        onClick={next}
        disabled={!canGoNext}
        className={`
          rounded-md border border-gray-300 px-3 py-1.5 text-sm transition-colors
          hover:bg-gray-100
          disabled:cursor-not-allowed disabled:opacity-50
          dark:border-gray-700 dark:hover:bg-gray-800
        `}
      >
        다음
      </button>

      {showFirstLast && (
        <button
          onClick={goToLast}
          disabled={!canGoNext}
          className={`
            rounded-md border border-gray-300 px-3 py-1.5 text-sm transition-colors
            hover:bg-gray-100
            disabled:cursor-not-allowed disabled:opacity-50
            dark:border-gray-700 dark:hover:bg-gray-800
          `}
        >
          마지막
        </button>
      )}
    </div>
  );
}
