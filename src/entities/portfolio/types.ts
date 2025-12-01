import type { PortfolioMetadata } from '@/core/types/metadata';

export type Portfolio = PortfolioMetadata & {
  slug: string;
  content?: string; // MDX 콘텐츠
  filePath?: string; // MDX 파일 경로
};
