'use client';

import type { PaginationInfo } from '@jinho-blog/shared';

import { LinkButton, Show } from '@/core/ui';
import { cn } from '@/core/utils';

import { usePagination } from '@/features/pagination/lib';

type Props = {
  className?: string;
  pagination: PaginationInfo;
  showFirstLast?: boolean;
  maxPageButtons?: number;
};

export function Pagination({ className, pagination, showFirstLast = false, maxPageButtons = 5 }: Props) {
  const {
    currentPage,
    getPageHref,
    getNextPageHref,
    getPrevPageHref,
    getFirstPageHref,
    getLastPageHref,
    hasNext,
    hasPrev,
    getPageNumbers,
  } = usePagination(pagination);

  if (pagination.totalPages <= 1) return null;

  const prevHref = getPrevPageHref();
  const nextHref = getNextPageHref();
  const firstHref = getFirstPageHref();
  const lastHref = getLastPageHref();

  const pageNumbers = getPageNumbers(maxPageButtons);
  const showStartEllipsis = pageNumbers[0] > 1;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < pagination.totalPages;

  return (
    <div className={cn('flex-row-center gap-2', className)}>
      <Show when={showFirstLast}>
        <LinkButton
          href={firstHref || ''}
          disabled={!hasPrev}
        >
          처음
        </LinkButton>
      </Show>

      <LinkButton
        href={prevHref || ''}
        disabled={!hasPrev}
      >
        이전
      </LinkButton>

      <Show when={showStartEllipsis}>
        <LinkButton href={getPageHref(1) || ''}>1</LinkButton>
        <span className="px-1 text-gray-400">...</span>
      </Show>

      {pageNumbers.map(page => (
        <LinkButton
          key={page}
          href={getPageHref(page) || ''}
          disabled={page === currentPage}
        >
          {page}
        </LinkButton>
      ))}

      <Show when={showEndEllipsis}>
        <span className="px-1 text-gray-400">...</span>
        <LinkButton href={getPageHref(pagination.totalPages) || ''}>{pagination.totalPages}</LinkButton>
      </Show>

      <LinkButton
        href={nextHref || ''}
        disabled={!hasNext}
      >
        다음
      </LinkButton>

      <Show when={showFirstLast}>
        <LinkButton
          href={lastHref || ''}
          disabled={!hasNext}
        >
          마지막
        </LinkButton>
      </Show>
    </div>
  );
}
