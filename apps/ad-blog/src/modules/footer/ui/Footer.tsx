import Link from 'next/link';

import { SITE_NAME } from '@/core/config';
import { Container } from '@/core/ui';

import { getPages } from '@/entities/page';

const LINK_CLASS_NAME = `
  inline-flex min-h-11 items-center px-2
  hover:text-foreground hover:underline hover:underline-offset-4
`;

/**
 * 사이트 푸터: 정적 페이지(소개·문의·개인정보처리방침) + RSS + 저작권
 */
export function Footer() {
  const pages = getPages();
  // 정적 빌드 시점 연도
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border">
      <Container
        className={`
          flex flex-col gap-2 py-6 text-sm text-muted
          sm:flex-row sm:items-center sm:justify-between
        `}
      >
        <nav aria-label="사이트 정보">
          <ul className="-mx-2 flex flex-wrap">
            {pages.map(page => (
              <li key={page.slug}>
                <Link
                  href={page.path}
                  className={LINK_CLASS_NAME}
                >
                  {page.title}
                </Link>
              </li>
            ))}
            <li>
              {/* 페이지가 아닌 정적 파일이므로 next/link 대신 일반 링크 */}
              <a
                href="/rss.xml"
                className={LINK_CLASS_NAME}
              >
                RSS 피드
              </a>
            </li>
          </ul>
        </nav>

        <p>
          <small className="text-sm">
            © {year} {SITE_NAME}
          </small>
        </p>
      </Container>
    </footer>
  );
}
