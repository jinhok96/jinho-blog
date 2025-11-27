import type { Metadata } from 'next';

import Link from 'next/link';

import { generatePageMetadata } from '@/core/utils';

import { getPortfolios } from '@/entities/portfolio';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'portfolio',
  title: 'Portfolio',
  description: '포트폴리오 목록',
});

export default async function PortfolioListPage() {
  const portfolios = await getPortfolios();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Portfolio</h1>
      <div className={`
        grid grid-cols-1 gap-6
        md:grid-cols-2
        lg:grid-cols-3
      `}>
        {portfolios.map(portfolio => (
          <Link
            key={portfolio.slug}
            href={`/portfolio/${portfolio.slug}`}
            className={`
              block rounded-lg border p-6 transition-shadow
              hover:shadow-lg
            `}
          >
            <h2 className="mb-2 text-xl font-bold">{portfolio.title}</h2>
            <p className="text-gray-600">{portfolio.description}</p>
            {portfolio.category.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {portfolio.category.map(cat => (
                  <span key={cat} className="rounded-sm bg-gray-100 px-2 py-1 text-sm text-gray-700">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
