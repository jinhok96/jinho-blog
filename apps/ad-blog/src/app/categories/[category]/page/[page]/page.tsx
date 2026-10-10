import type { Category } from '@/core/config';
import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getExtraPageNumbers, parsePageNumber } from '@/core/routes';
import { breadcrumbJsonLd, JsonLd } from '@/core/seo';
import { withEmptyStaticParam } from '@/core/utils';

import { getCategorySummaries, getPostPageCount, getPostsPage } from '@/entities/post';

import { buildCategoryMetadata, CategoryView, findCategory, getCategoryBreadcrumbs } from '@/views/category';

type Params = {
  category: string;
  page: string;
};

type Props = {
  params: Promise<Params>;
};

export const dynamicParams = false;

// 카테고리별 2페이지부터 생성 (1페이지는 `/categories/{category}`)
export function generateStaticParams() {
  return withEmptyStaticParam(
    getCategorySummaries().flatMap(({ category }) =>
      getExtraPageNumbers(getPostPageCount({ category })).map(page => ({ category, page: String(page) })),
    ),
    ['category', 'page'],
  );
}

/**
 * 유효한 카테고리 + 페이지 번호 (2 ~ 마지막 페이지), 아니면 null
 */
function resolveParams(params: Params): { category: Category; page: number } | null {
  const category = findCategory(params.category);
  const page = parsePageNumber(params.page);
  if (!category || !page || page < 2 || page > getPostPageCount({ category })) return null;

  return { category, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = resolveParams(await params);
  if (!resolved) return {};

  return buildCategoryMetadata(resolved.category, resolved.page);
}

export default async function CategoryPaginatedPage({ params }: Props) {
  const resolved = resolveParams(await params);
  if (!resolved) notFound();

  const { category, page } = resolved;
  const { items, pagination } = getPostsPage(page, { category });
  const breadcrumbs = getCategoryBreadcrumbs(category, page);

  return (
    <>
      <JsonLd jsonLd={breadcrumbJsonLd(breadcrumbs)} />
      <CategoryView
        category={category}
        posts={items}
        currentPage={page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
