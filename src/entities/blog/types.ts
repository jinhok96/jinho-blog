import type { BlogMetadata } from '@/core/types/metadata';

export type Blog = BlogMetadata & {
  slug: string;
  content?: string; // MDX 콘텐츠 (MDX 파일의 경우)
  filePath?: string; // MDX 파일 경로
  Component?: React.FC; // TSX 컴포넌트 (TSX 파일의 경우)
};
