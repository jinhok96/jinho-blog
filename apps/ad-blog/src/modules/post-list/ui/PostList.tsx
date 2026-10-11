import type { Post } from '@/entities/post';

import { cn } from '@/core/utils';

import { PostCard } from './PostCard';

type Props = {
  posts: Post[];
  /** 카드 제목 단계 */
  headingLevel?: 2 | 3;
  /** 앞에서부터 우선 로딩할 썸네일 수 (첫 화면 목록에서만 지정) */
  priorityCount?: number;
  emptyMessage?: string;
  className?: string;
};

/**
 * 글 카드 목록 (모바일 1열 → 2열 → 3열)
 */
export function PostList({
  posts,
  headingLevel = 2,
  priorityCount = 0,
  emptyMessage = '아직 발행된 글이 없습니다.',
  className,
}: Props) {
  if (posts.length === 0) {
    return <p className={cn('py-16 text-center text-muted', className)}>{emptyMessage}</p>;
  }

  return (
    <ul
      className={cn(
        `
          grid gap-6
          sm:grid-cols-2
          lg:grid-cols-3
        `,
        className,
      )}
    >
      {posts.map((post, index) => (
        <li key={post.slug}>
          <PostCard
            post={post}
            headingLevel={headingLevel}
            priority={index < priorityCount}
          />
        </li>
      ))}
    </ul>
  );
}
