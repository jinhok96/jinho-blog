import type { Project } from '@jinho-blog/mdx-handler';
import type { ContentSortOption, PaginatedResult, ProjectCategory, TechStack } from '@jinho-blog/shared';

export type GetProjects = {
  search: {
    category?: ProjectCategory;
    sort?: ContentSortOption;
    tech?: TechStack;
    page?: string;
    count?: string;
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
