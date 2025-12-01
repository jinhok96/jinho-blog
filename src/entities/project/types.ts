import type { ProjectMetadata } from '@/core/types/metadata';

export type Project = ProjectMetadata & {
  slug: string;
  content?: string; // MDX 콘텐츠
  filePath?: string; // MDX 파일 경로
};
