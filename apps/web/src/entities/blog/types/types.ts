import type { Blog } from '@jinho-blog/mdx-handler';
import type { BlogCategory, PaginatedResult, SortOption } from '@jinho-blog/shared';

export type GetBlogPosts = {
  search: {
    category?: BlogCategory;
    sort?: SortOption;
    page?: string;
    count?: string;
    search?: string;
  };
  response: PaginatedResult<Blog>;
};

export type GetBlogPost = {
  params: {
    slug: string;
  };
  response: Blog;
};

export type GetBlogContent = {
  params: {
    slug: string;
  };
  response: string;
};
