import type { Blog } from '@jinho-blog/mdx-handler';
import type { BlogCategory, PaginatedResult, SortOption } from '@jinho-blog/shared';

export type GetBlogPosts = {
  search: {
    category?: BlogCategory;
    sort?: SortOption;
    page?: string | number;
    count?: string | number;
    search?: string;
  };
  response: PaginatedResult<Blog>;
};

export type GetBlogPost = {
  params: {
    slug: string;
  };
  response: Blog | null;
};

export type GetBlogContent = {
  params: {
    slug: string;
  };
  response: string | null;
};
