import type { Translate } from '@jinho-blog/mdx-handler';
import type { PaginatedResult, SortOption, TranslateCategory } from '@jinho-blog/shared';

export type GetTranslatePosts = {
  search: {
    category?: TranslateCategory;
    sort?: SortOption;
    page?: string | number;
    count?: string | number;
    search?: string;
  };
  response: PaginatedResult<Translate>;
};

export type GetTranslatePost = {
  params: {
    slug: string;
  };
  response: Translate | null;
};

export type GetTranslateContent = {
  params: {
    slug: string;
  };
  response: string | null;
};
