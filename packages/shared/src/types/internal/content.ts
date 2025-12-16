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
type GetContentOptions<TCategory extends string> = {
  category?: TCategory; // 카테고리
  sort?: ContentSortOption;
  page?: number; // 페이지 번호 (1-based)
  count?: number; // 페이지당 아이템 수
  search?: string; // 제목/설명 검색어
  // 하위 호환성 (deprecated)
  limit?: number; // 결과 개수 제한
  offset?: number; // 페이지네이션 오프셋
};

// 각 엔티티별 타입 별칭
export type GetBlogPostsOptions = GetContentOptions<BlogCategory>;

export type GetProjectsOptions = GetContentOptions<ProjectCategory>;

export type GetLibrariesOptions = GetContentOptions<LibraryCategory>;
