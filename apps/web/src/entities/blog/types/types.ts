import type { ContentEntryOf } from '@/core/content';
import type { BlogCategory, PaginatedResult, SortOption } from '@jinho-blog/shared';

/** 블로그 포스트 (frontmatter + 빌드 생성 필드) */
export type Blog = ContentEntryOf<'blog'>;

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
