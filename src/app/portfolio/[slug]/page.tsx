import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { MDXComponent } from '@/core/mdx';
import { generatePageMetadata } from '@/core/utils';

import { getPortfolio, getPortfolios } from '@/entities/portfolio';

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG: 빌드 시 모든 경로 생성
export async function generateStaticParams() {
  const portfolios = await getPortfolios();
  return portfolios.map(portfolio => ({ slug: portfolio.slug }));
}

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) return {};

  return generatePageMetadata({
    routerName: 'portfolio',
    title: portfolio.title,
    description: portfolio.description,
  });
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 text-4xl font-bold">{portfolio.title}</h1>
      <p className="mb-8 text-gray-600">{portfolio.description}</p>
      <span
        key={portfolio.category}
        className="rounded-sm bg-gray-100 px-3 py-1 text-sm text-gray-700"
      >
        {portfolio.category}
      </span>

      <MDXComponent filePath={portfolio.filePath} />
    </article>
  );
}
