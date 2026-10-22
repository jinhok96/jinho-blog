import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { NoAds } from '@/core/ads';
import { renderMdx } from '@/core/mdx';
import { HOME_BREADCRUMB } from '@/core/routes';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/core/seo';
import { withEmptyStaticParam } from '@/core/utils';

import { getPage, getPages } from '@/entities/page';

import { StaticPageView } from '@/views/static-page';

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

// 루트 경로 정적 페이지 (content/pages/about.mdx → /about)
export function generateStaticParams() {
  return withEmptyStaticParam(
    getPages().map(page => ({ slug: page.slug })),
    ['slug'],
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPage((await params).slug);
  if (!page) return {};

  return buildMetadata({
    path: page.path,
    title: page.title,
    description: page.description,
  });
}

export default async function StaticPage({ params }: Props) {
  const page = getPage((await params).slug);
  if (!page) notFound();

  const { content } = await renderMdx(page.content, page.path);
  const breadcrumbs = [HOME_BREADCRUMB, { name: page.title, path: page.path }];

  return (
    <>
      {/* 소개·문의·개인정보처리방침에는 광고를 두지 않음 → 자동 광고 스크립트를 로드하지 않음 */}
      <NoAds />
      <JsonLd jsonLd={breadcrumbJsonLd(breadcrumbs)} />
      <StaticPageView
        page={page}
        content={content}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
