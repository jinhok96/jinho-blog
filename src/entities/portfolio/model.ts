import type { Portfolio } from './types';

// Portfolio 파일들을 직접 import
import ExamplePortfolio, { metadata as examplePortfolioMeta } from '@/views/portfolio/example-portfolio';

const portfolioList: Portfolio[] = [
  {
    slug: 'example-portfolio',
    title: examplePortfolioMeta?.title || 'example-portfolio',
    description: examplePortfolioMeta?.description || '',
    tags: examplePortfolioMeta?.tags || [],
    Component: ExamplePortfolio,
  },
];

export async function getPortfolios(): Promise<Portfolio[]> {
  return portfolioList;
}

export async function getPortfolio(slug: string): Promise<Portfolio | null> {
  return portfolioList.find(p => p.slug === slug) || null;
}
