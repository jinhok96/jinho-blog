import type { Library } from '@jinho-blog/mdx-handler';
import type { LibraryCategory, PaginatedResult, SortOption, TechStack } from '@jinho-blog/shared';

export type GetLibraries = {
  search: {
    category?: LibraryCategory;
    sort?: SortOption;
    tech?: TechStack;
    page?: string;
    count?: string;
    search?: string;
  };
  response: PaginatedResult<Library>;
};

export type GetLibraryGroupsByCategory = {
  search: {
    count?: string;
  };
  response: Record<LibraryCategory, Library[]>;
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
