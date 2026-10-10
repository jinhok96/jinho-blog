import type { BreadcrumbItem } from '@/core/seo';

import Link from 'next/link';

import { cn } from '@/core/utils';

type Props = {
  /** 홈부터 현재 페이지까지 (breadcrumbJsonLd와 같은 항목 사용) */
  items: BreadcrumbItem[];
  className?: string;
};

/**
 * 탐색 경로 (마지막 항목은 현재 페이지 — 링크 없이 표시)
 */
export function Breadcrumbs({ items, className }: Props) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn('text-sm text-muted', className)}
    >
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li
              key={item.path}
              className="flex min-w-0 items-center gap-1.5"
            >
              {index > 0 && <span aria-hidden="true">›</span>}
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="truncate text-foreground"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={`
                    inline-block py-1 underline-offset-4
                    hover:text-foreground hover:underline
                  `}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
