import type { Project } from '@jinho-blog/mdx-handler';
import type { ContentSortOption, PaginatedResult, ProjectCategory } from '@jinho-blog/shared';

export type GetProjects = {
  Params: {
    category?: ProjectCategory;
    sort?: ContentSortOption;
    page?: string;
    count?: string;
    search?: string;
  };
  Response: PaginatedResult<Project>;
};
