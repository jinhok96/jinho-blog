import Link from 'next/link';

import { paginatedPath } from '@/core/routes';
import { cn } from '@/core/utils';

import { getPaginationItems } from './getPaginationItems';

const ITEM_CLASS_NAME = 'inline-flex h-11 min-w-11 items-center justify-center rounded-md px-3 text-sm';
const LINK_CLASS_NAME = 'hover:bg-surface';

type StepLinkProps = {
  href: string | null;
  rel: 'prev' | 'next';
  label: string;
};

/**
 * 이전·다음 페이지 링크 (없으면 자리만 유지)
 */
function StepLink({ href, rel, label }: StepLinkProps) {
  const text = rel === 'prev' ? `‹ ${label}` : `${label} ›`;

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={cn(ITEM_CLASS_NAME, 'text-muted opacity-50')}
      >
        {text}
      </span>
    );
  }

  return (
    <Link
      href={href}
      rel={rel}
      aria-label={`${label} 페이지`}
      className={cn(ITEM_CLASS_NAME, LINK_CLASS_NAME, 'font-medium')}
    >
      {text}
    </Link>
  );
}

type Props = {
  /** 1페이지 경로 (예: '/', '/categories/general') */
  basePath: string;
  currentPage: number;
  totalPages: number;
  className?: string;
};

/**
 * 목록 페이지 이동 (링크만 사용 — JS 없이 동작, 크롤러가 모든 페이지를 따라갈 수 있음)
 * - 1페이지 → basePath, n페이지 → `{basePath}/page/{n}`
 * - 좁은 화면은 번호 대신 `현재 / 전체` 표시
 */
export function Pagination({ basePath, currentPage, totalPages, className }: Props) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(currentPage, totalPages);

  return (
    <nav
      aria-label="페이지 이동"
      className={className}
    >
      <ul
        className={`
          flex items-center justify-between gap-1
          sm:justify-center
        `}
      >
        <li>
          <StepLink
            href={currentPage > 1 ? paginatedPath(basePath, currentPage - 1) : null}
            rel="prev"
            label="이전"
          />
        </li>

        <li
          className={`
            text-sm text-muted
            sm:hidden
          `}
        >
          <span aria-hidden="true">
            {currentPage} / {totalPages}
          </span>
          <span className="sr-only">
            전체 {totalPages}페이지 중 {currentPage}페이지
          </span>
        </li>

        {items.map(item =>
          typeof item === 'number' ? (
            <li
              key={item}
              className={`
                hidden
                sm:block
              `}
            >
              <Link
                href={paginatedPath(basePath, item)}
                aria-label={`${item}페이지`}
                aria-current={item === currentPage ? 'page' : undefined}
                className={cn(
                  ITEM_CLASS_NAME,
                  item === currentPage ? 'bg-foreground font-semibold text-background' : LINK_CLASS_NAME,
                )}
              >
                {item}
              </Link>
            </li>
          ) : (
            <li
              key={item}
              aria-hidden="true"
              className={`
                hidden px-1 text-muted
                sm:block
              `}
            >
              …
            </li>
          ),
        )}

        <li>
          <StepLink
            href={currentPage < totalPages ? paginatedPath(basePath, currentPage + 1) : null}
            rel="next"
            label="다음"
          />
        </li>
      </ul>
    </nav>
  );
}
