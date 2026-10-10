import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { SITE_NAME } from '@/core/config';
import {
  getExtraPageNumbers,
  HOME_BREADCRUMB,
  HOME_PATH,
  paginatedPath,
  paginatedTitle,
  parsePageNumber,
} from '@/core/routes';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/core/seo';
import { withEmptyStaticParam } from '@/core/utils';

import { getPostPageCount, getPostsPage } from '@/entities/post';

import { PostsPageView } from '@/views/posts';

const TITLE = '전체 글';

type Props = {
  params: Promise<{ page: string }>;
};

export const dynamicParams = false;

// 2페이지부터 생성 (1페이지는 홈 `/`)
export function generateStaticParams() {
  return withEmptyStaticParam(
    getExtraPageNumbers(getPostPageCount()).map(page => ({ page: String(page) })),
    ['page'],
  );
}

/**
 * 유효한 페이지 번호 (2 ~ 마지막 페이지), 아니면 null
 */
function resolvePage(value: string): number | null {
  const page = parsePageNumber(value);
  if (!page || page < 2 || page > getPostPageCount()) return null;

  return page;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = resolvePage((await params).page);
  if (!page) return {};

  return buildMetadata({
    path: paginatedPath(HOME_PATH, page),
    title: paginatedTitle(TITLE, page),
    description: `${SITE_NAME}의 전체 글 목록 ${page}페이지입니다.`,
  });
}

export default async function PostsPage({ params }: Props) {
  const page = resolvePage((await params).page);
  if (!page) notFound();

  const { items, pagination } = getPostsPage(page);
  const breadcrumbs = [HOME_BREADCRUMB, { name: paginatedTitle(TITLE, page), path: paginatedPath(HOME_PATH, page) }];

  return (
    <>
      <JsonLd jsonLd={breadcrumbJsonLd(breadcrumbs)} />
      <PostsPageView
        posts={items}
        currentPage={page}
        totalPages={pagination.totalPages}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
