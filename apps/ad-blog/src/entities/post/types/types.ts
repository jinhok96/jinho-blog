import type { ContentEntryOf } from '@/core/content';

/** 글 (frontmatter + 빌드 생성 필드) */
export type Post = ContentEntryOf<'posts'>;

export type AdjacentPosts = {
  /** 이전 글 (더 오래된 글) */
  previous: Post | null;
  /** 다음 글 (더 최신 글) */
  next: Post | null;
};

export type CategorySummary = {
  category: Post['category'];
  count: number;
};

export type PostListOptions = {
  category?: Post['category'];
};
