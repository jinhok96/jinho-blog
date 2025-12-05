import type { BlogCategory, LibraryCategory, ProjectCategory } from './category';

// 공통 정렬 옵션
export type ContentSortOption = 'latest' | 'oldest' | 'updated';

// 제네릭 조회 옵션 인터페이스
type GetContentOptions<TCategory extends string> = {
  category?: TCategory | TCategory[]; // 단일 또는 복수 카테고리
  sort?: ContentSortOption;
  limit?: number; // 결과 개수 제한
  offset?: number; // 페이지네이션 오프셋
  search?: string; // 제목/설명 검색어
};

// 각 엔티티별 타입 별칭
export type GetBlogPostsOptions = GetContentOptions<BlogCategory>;

export type GetProjectsOptions = GetContentOptions<ProjectCategory>;

export type GetLibrariesOptions = GetContentOptions<LibraryCategory>;
