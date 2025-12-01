import type { BlogMetadata } from '@/core/types/metadata';

export type Blog = BlogMetadata & {
  slug: string;
  content?: string; // MDX 콘텐츠
  filePath?: string; // MDX 파일 경로
};
