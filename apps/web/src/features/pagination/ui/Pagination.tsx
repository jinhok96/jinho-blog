'use client';

import type { PaginationInfo } from '@jinho-blog/shared';
import type { ComponentProps, ReactNode } from 'react';

import { Button, LinkButton } from '@/core/ui';
import { cn } from '@/core/utils';

import { usePagination } from '@/features/pagination/lib';

import ChevronLeftIcon from 'public/icons/chevron_left.svg';
import ChevronRightIcon from 'public/icons/chevron_right.svg';
import FirstPageIcon from 'public/icons/first_page.svg';
import LastPageIcon from 'public/icons/last_page.svg';

const BUTTON_CLASSNAME = 'flex-row-center aspect-square size-10 shrink-0 justify-center p-0 leading-none';
const CURRENT_CLASSNAME = 'text-blue-7 font-semibold hover:bg-transparent cursor-default';

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
      className={cn(BUTTON_CLASSNAME, current && CURRENT_CLASSNAME)}
      {...props}
    >
      {children}
    </LinkButton>
  );
}

type PaginationActionButtonProps = {
  page: number | null;
  disabled?: boolean;
  current?: boolean;
  ariaLabel?: string;
  onPageChange: (page: number) => void;
  children: ReactNode;
};

function PaginationActionButton({
  page,
  disabled,
  current,
  ariaLabel,
  onPageChange,
  children,
}: PaginationActionButtonProps) {
  return (
    <Button
      disabled={!page || disabled}
      size="md"
      color="background"
      className={cn(BUTTON_CLASSNAME, current && CURRENT_CLASSNAME)}
      aria-label={ariaLabel}
      aria-current={current ? 'page' : undefined}
      onClick={() => page && onPageChange(page)}
    >
      {children}
    </Button>
  );
}

type Props = {
  className?: string;
  pagination: PaginationInfo;
  maxPageButtons?: number;
  scroll?: boolean;
  /**
   * 지정하면 URL을 바꾸지 않고 콜백으로만 페이지를 전환합니다.
   * 상세 페이지의 '다른 글' 같은 부가 목록에서 중복 URL 생성을 막고
   * 정적 프리렌더(SSG)를 유지하기 위해 사용합니다.
   */
  onPageChange?: (page: number) => void;
};

export function Pagination({ className, pagination, maxPageButtons = 5, scroll, onPageChange }: Props) {
  if (onPageChange) {
    return (
      <PaginationButtons
        className={className}
        pagination={pagination}
        maxPageButtons={maxPageButtons}
        onPageChange={onPageChange}
      />
    );
  }

  return (
    <PaginationLinks
      className={className}
      pagination={pagination}
      maxPageButtons={maxPageButtons}
      scroll={scroll}
    />
  );
}

/** 페이지 번호 목록을 계산합니다. URL 의존 없이 순수 계산만 수행합니다. */
function getPageNumbers(currentPage: number, totalPages: number, maxPageButtons: number) {
  const half = Math.floor(maxPageButtons / 2);

  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxPageButtons - 1);

  if (end - start + 1 < maxPageButtons) {
    start = Math.max(1, end - maxPageButtons + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

type PaginationButtonsProps = {
  className?: string;
  pagination: PaginationInfo;
  maxPageButtons: number;
  onPageChange: (page: number) => void;
};

/** URL을 바꾸지 않는 버튼형 페이지네이션 */
function PaginationButtons({ className, pagination, maxPageButtons, onPageChange }: PaginationButtonsProps) {
  const { currentPage, totalPages, hasNext, hasPrev, nextPage, prevPage } = pagination;

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages, maxPageButtons);

  return (
    <nav
      aria-label="페이지 이동"
      className={cn('flex-row-center w-full justify-center pt-12', className)}
    >
      <PaginationActionButton
        page={1}
        disabled={!hasPrev}
        ariaLabel="첫 페이지"
        onPageChange={onPageChange}
      >
        <div className="size-3.5">
          <FirstPageIcon strokeWidth={1.5} />
        </div>
      </PaginationActionButton>

      <PaginationActionButton
        page={prevPage}
        disabled={!hasPrev}
        ariaLabel="이전 페이지"
        onPageChange={onPageChange}
      >
        <div className="size-3.5">
          <ChevronLeftIcon strokeWidth={1.5} />
        </div>
      </PaginationActionButton>

      {pageNumbers.map(page => (
        <PaginationActionButton
          key={page}
          page={page}
          current={page === currentPage}
          ariaLabel={`${page}페이지`}
          onPageChange={onPageChange}
        >
          {page}
        </PaginationActionButton>
      ))}

      <PaginationActionButton
        page={nextPage}
        disabled={!hasNext}
        ariaLabel="다음 페이지"
        onPageChange={onPageChange}
      >
        <div className="size-3.5">
          <ChevronRightIcon strokeWidth={1.5} />
        </div>
      </PaginationActionButton>

      <PaginationActionButton
        page={totalPages}
        disabled={!hasNext}
        ariaLabel="마지막 페이지"
        onPageChange={onPageChange}
      >
        <div className="size-3.5">
          <LastPageIcon strokeWidth={1.5} />
        </div>
      </PaginationActionButton>
    </nav>
  );
}

type PaginationLinksProps = {
  className?: string;
  pagination: PaginationInfo;
  maxPageButtons: number;
  scroll?: boolean;
};

/** `?page` 쿼리를 사용하는 링크형 페이지네이션 */
function PaginationLinks({ className, pagination, maxPageButtons, scroll }: PaginationLinksProps) {
  const {
    currentPage,
    getPageHref,
    getNextPageHref,
    getPrevPageHref,
    getFirstPageHref,
    getLastPageHref,
    hasNext,
    hasPrev,
  } = usePagination(pagination);

  if (pagination.totalPages <= 1) return null;

  const prevHref = getPrevPageHref();
  const nextHref = getNextPageHref();
  const firstHref = getFirstPageHref();
  const lastHref = getLastPageHref();
  const pageNumbers = getPageNumbers(currentPage, pagination.totalPages, maxPageButtons);

  return (
    <nav
      aria-label="페이지 이동"
      className={cn('flex-row-center w-full justify-center pt-12', className)}
    >
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
          aria-current={page === currentPage ? 'page' : undefined}
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
    </nav>
  );
}
