import type { ContentEntryOf } from '@/core/content';
import type { LibraryCategory, PaginatedResult, SortOption, TechStack } from '@jinho-blog/shared';

/** 라이브러리 (frontmatter + 빌드 생성 필드) */
export type Library = ContentEntryOf<'libraries'>;

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
  response: Partial<Record<LibraryCategory, Library[]>>;
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
