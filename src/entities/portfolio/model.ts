import type { Portfolio } from './types';
import type { PortfolioCategory } from '@/core/types/metadata';

import { getPortfolioListByCategory, portfolioRegistry } from './registry.generated';

export async function getPortfolios(): Promise<Portfolio[]> {
  return portfolioRegistry;
}

export async function getPortfolio(slug: string): Promise<Portfolio | null> {
  return portfolioRegistry.find(p => p.slug === slug) || null;
}

export async function getPortfoliosByCategory(category: PortfolioCategory): Promise<Portfolio[]> {
  return getPortfolioListByCategory(category);
}
