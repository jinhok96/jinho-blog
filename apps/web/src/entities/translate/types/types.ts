import type { ContentEntryOf } from '@/core/content';
import type { PaginatedResult, SortOption, TranslateCategory } from '@jinho-blog/shared';

/** 번역 포스트 (frontmatter + 빌드 생성 필드) */
export type Translate = ContentEntryOf<'translate'>;

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
