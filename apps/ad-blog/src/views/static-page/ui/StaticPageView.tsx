import type { BreadcrumbItem } from '@/core/seo';
import type { Page } from '@/entities/page';
import type { ReactNode } from 'react';

import { Breadcrumbs, Container, PageHeader, Prose } from '@/core/ui';
import { formatDate } from '@/core/utils';

type Props = {
  page: Page;
  /** 렌더링된 MDX 본문 */
  content: ReactNode;
  breadcrumbs: BreadcrumbItem[];
};

/**
 * 정적 페이지 (소개·문의·개인정보처리방침 등)
 */
export function StaticPageView({ page, content, breadcrumbs }: Props) {
  return (
    <Container
      size="narrow"
      className={`
        py-8
        sm:py-12
      `}
    >
      <Breadcrumbs
        items={breadcrumbs}
        className="mb-6"
      />

      <article>
        <PageHeader
          title={page.title}
          description={page.description}
          className="border-b border-border pb-6"
        />
        <Prose className="mt-8">{content}</Prose>
        <p className="mt-12 text-sm text-muted">
          최종 수정일 <time dateTime={page.updatedAt}>{formatDate(page.updatedAt)}</time>
        </p>
      </article>
    </Container>
  );
}
