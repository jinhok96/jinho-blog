import type { ContentEntryOf } from '@/core/content';
import type { PaginatedResult, ProjectCategory, SortOption, TechStack } from '@jinho-blog/shared';

/** 프로젝트 (frontmatter + 빌드 생성 필드) */
export type Project = ContentEntryOf<'projects'>;

export type GetProjects = {
  search: {
    category?: ProjectCategory;
    sort?: SortOption;
    tech?: TechStack;
    page?: string | number;
    count?: string | number;
    search?: string;
  };
  response: PaginatedResult<Project>;
};

export type GetProject = {
  params: {
    slug: string;
  };
  response: Project | null;
};

export type GetProjectContent = {
  params: {
    slug: string;
  };
  response: string | null;
};
