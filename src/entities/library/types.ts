import type { LibraryMetadata } from '@/core/types/metadata';

export type Library = LibraryMetadata & {
  slug: string;
  content?: string; // MDX 콘텐츠
  filePath?: string; // MDX 파일 경로
};
