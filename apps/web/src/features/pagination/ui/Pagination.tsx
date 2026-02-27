'use client';

import type { PaginationInfo } from '@jinho-blog/shared';
import type { ComponentProps } from 'react';

import { LinkButton } from '@/core/ui';
import { cn } from '@/core/utils';

import { usePagination } from '@/features/pagination/lib';

import ChevronLeftIcon from 'public/icons/chevron_left.svg';
import ChevronRightIcon from 'public/icons/chevron_right.svg';
import FirstPageIcon from 'public/icons/first_page.svg';
import LastPageIcon from 'public/icons/last_page.svg';

type PaginationLinkButtonProps = Omit<ComponentProps<typeof LinkButton>, 'size' | 'color' | 'className' | 'href'> & {
  href: string | null;
  current?: boolean;
};

function PaginationLinkButton({ href, disabled, current, children, ...props }: PaginationLinkButtonProps) {
  return (
    <LinkButton
      href={href || '#'}
      disabled={!href || disabled}
      size="md"
      color="background"
      className={cn(
        'flex-row-center aspect-square size-10 shrink-0 justify-center p-0 leading-none',
        current && 'text-blue-7 font-semibold hover:bg-transparent cursor-default',
      )}
      {...props}
    >
      {children}
    </LinkButton>
  );
}

type Props = {
  className?: string;
  pagination: PaginationInfo;
  maxPageButtons?: number;
  scroll?: boolean;
};

export function Pagination({ className, pagination, maxPageButtons = 5, scroll }: Props) {
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

  return (
    <div className={cn('flex-row-center w-full justify-center pt-12', className)}>
      {/* 처음 */}
      <PaginationLinkButton
        href={firstHref}
        disabled={!hasPrev}
        scroll={scroll}
        aria-label="첫 페이지"
      >
        <div className="size-3.5">
          <FirstPageIcon strokeWidth={1.5} />
        </div>
      </PaginationLinkButton>

      {/* 이전 */}
      <PaginationLinkButton
        href={prevHref || ''}
        disabled={!hasPrev}
        scroll={scroll}
        aria-label="이전 페이지"
      >
        <div className="size-3.5">
          <ChevronLeftIcon strokeWidth={1.5} />
        </div>
      </PaginationLinkButton>

      {/* 페이지 */}
      {pageNumbers.map(page => (
        <PaginationLinkButton
          key={page}
          href={getPageHref(page)}
          current={page === currentPage}
          scroll={scroll}
        >
          {page}
        </PaginationLinkButton>
      ))}

      {/* 다음 */}
      <PaginationLinkButton
        href={nextHref}
        disabled={!hasNext}
        scroll={scroll}
        aria-label="다음 페이지"
      >
        <div className="size-3.5">
          <ChevronRightIcon strokeWidth={1.5} />
        </div>
      </PaginationLinkButton>

      {/* 마지막 */}
      <PaginationLinkButton
        href={lastHref}
        disabled={!hasNext}
        scroll={scroll}
        aria-label="마지막 페이지"
      >
        <div className="size-3.5">
          <LastPageIcon strokeWidth={1.5} />
        </div>
      </PaginationLinkButton>
    </div>
  );
}
