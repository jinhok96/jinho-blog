import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { breadcrumbJsonLd, JsonLd } from '@/core/seo';
import { withEmptyStaticParam } from '@/core/utils';

import { getCategorySummaries, getPostsPage } from '@/entities/post';

import { buildCategoryMetadata, CategoryView, findCategory, getCategoryBreadcrumbs } from '@/views/category';

type Props = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = false;

// 글이 있는 카테고리만 생성
export function generateStaticParams() {
  return withEmptyStaticParam(
    getCategorySummaries().map(({ category }) => ({ category })),
    ['category'],
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = findCategory((await params).category);
  if (!category) return {};

  return buildCategoryMetadata(category, 1);
}

export default async function CategoryPage({ params }: Props) {
  const category = findCategory((await params).category);
  if (!category) notFound();

  const { items, pagination } = getPostsPage(1, { category });
  const breadcrumbs = getCategoryBreadcrumbs(category, 1);

  return (
    <>
      <JsonLd jsonLd={breadcrumbJsonLd(breadcrumbs)} />
      <CategoryView
        category={category}
        posts={items}
        currentPage={1}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
