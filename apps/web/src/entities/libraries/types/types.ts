import type { Library } from '@jinho-blog/mdx-handler';
import type { ContentSortOption, LibraryCategory, PaginatedResult } from '@jinho-blog/shared';

export type GetLibraries = {
  Params: {
    category?: LibraryCategory;
    sort?: ContentSortOption;
    page?: string;
    count?: string;
    search?: string;
  };
  Response: PaginatedResult<Library>;
};
