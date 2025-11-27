import type { PortfolioMetadata } from '@/core/types/metadata';
import type { FC } from 'react';

export type Portfolio = PortfolioMetadata & {
  slug: string;
  Component: FC;
};
