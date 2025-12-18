import type { BlogCategory, LibraryCategory, ProjectCategory } from './category';

// 공통 정렬 옵션
export type ContentSortOption = 'latest' | 'oldest' | 'updated';

// 페이지네이션 정보
export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

// 페이지네이션된 결과
export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationInfo;
};

// 제네릭 조회 옵션 인터페이스
type GetContentOptions<TCategory extends string, TSort extends string> = {
  category?: TCategory | null; // 카테고리
  sort?: TSort | null; // 정렬
  page?: number | null; // 페이지 번호 (1-based)
  count?: number | null; // 페이지당 아이템 수
  search?: string | null; // 제목/설명 검색어
};

// 각 엔티티별 타입 별칭
export type GetBlogPostsOptions = GetContentOptions<BlogCategory, ContentSortOption>;

export type GetProjectsOptions = GetContentOptions<ProjectCategory, ContentSortOption>;

export type GetLibrariesOptions = GetContentOptions<LibraryCategory, ContentSortOption>;
