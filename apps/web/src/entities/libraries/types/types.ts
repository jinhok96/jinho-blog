import type { Library } from '@jinho-blog/mdx-handler';
import type { ContentSortOption, LibraryCategory, PaginatedResult, TechStack } from '@jinho-blog/shared';

export type GetLibraries = {
  search: {
    category?: LibraryCategory;
    sort?: ContentSortOption;
    tech?: TechStack;
    page?: string;
    count?: string;
    search?: string;
  };
  response: PaginatedResult<Library>;
};

export type GetLibrary = {
  params: {
    slug: string;
  };
  response: Library | null;
};

export type GetLibraryContent = {
  params: {
    slug: string;
  };
  response: string | null;
};
