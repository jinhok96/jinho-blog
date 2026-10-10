import Link from 'next/link';

import { CATEGORY_MAP, SITE_NAME } from '@/core/config';
import { categoryPath, HOME_PATH } from '@/core/routes';
import { Container } from '@/core/ui';

import { getCategorySummaries } from '@/entities/post';

/**
 * 사이트 헤더: 사이트 이름(홈 링크) + 글이 있는 카테고리 탐색
 * - 사이트 이름은 링크만 (페이지 `<h1>`은 각 페이지 제목)
 */
export function Header() {
  const categories = getCategorySummaries();

  return (
    <header className="border-b border-border">
      <Container
        className={`
          flex flex-wrap items-center justify-between gap-x-6 py-2
          sm:py-3
        `}
      >
        <Link
          href={HOME_PATH}
          className="inline-flex min-h-11 items-center text-lg font-bold tracking-tight"
        >
          {SITE_NAME}
        </Link>

        {categories.length > 0 && (
          <nav aria-label="카테고리">
            <ul className="-mx-3 flex flex-wrap items-center">
              {categories.map(({ category }) => (
                <li key={category}>
                  <Link
                    href={categoryPath(category)}
                    className={`
                      inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted
                      hover:text-foreground
                    `}
                  >
                    {CATEGORY_MAP[category].name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}
