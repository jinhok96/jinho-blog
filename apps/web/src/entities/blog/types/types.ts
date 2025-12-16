import type { Blog } from '@jinho-blog/mdx-handler';
import type { BlogCategory, ContentSortOption, PaginatedResult } from '@jinho-blog/shared';

export type GetBlogPosts = {
  Params: {
    category?: BlogCategory;
    sort?: ContentSortOption;
    page?: string;
    count?: string;
    search?: string;
  };
  Response: PaginatedResult<Blog>;
};
