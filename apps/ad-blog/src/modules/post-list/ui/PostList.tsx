import type { Post } from '@/entities/post';

import { Fragment } from 'react';

import { AdSlot } from '@/core/ads';
import { cn } from '@/core/utils';

import { getInFeedAdIndex } from '@/modules/post-list/lib';

import { PostCard } from './PostCard';

type Props = {
  posts: Post[];
  /** 카드 제목 단계 */
  headingLevel?: 2 | 3;
  /** 앞에서부터 우선 로딩할 썸네일 수 (첫 화면 목록에서만 지정) */
  priorityCount?: number;
  /** 카드 사이 인피드 광고 (페이지 단위 글 목록에서만 사용 — 관련 글 등 보조 목록은 기본값 끔) */
  inFeedAd?: boolean;
  emptyMessage?: string;
  className?: string;
};

/**
 * 글 카드 목록 (모바일 1열 → 2열 → 3열)
 * - 인피드 광고는 한 줄 전체를 차지하고, 광고가 렌더링되지 않거나 미게재면 줄 간격도 남기지 않음
 */
export function PostList({
  posts,
  headingLevel = 2,
  priorityCount = 0,
  inFeedAd = false,
  emptyMessage = '아직 발행된 글이 없습니다.',
  className,
}: Props) {
  if (posts.length === 0) {
    return <p className={cn('py-16 text-center text-muted', className)}>{emptyMessage}</p>;
  }

  const adIndex = inFeedAd ? getInFeedAdIndex(posts.length) : null;

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
        <Fragment key={post.slug}>
          <li>
            <PostCard
              post={post}
              headingLevel={headingLevel}
              priority={index < priorityCount}
            />
          </li>
          {index === adIndex && (
            <li
              className={`
                col-span-full
                empty:hidden
                has-[ins[data-ad-status=unfilled]]:hidden
              `}
            >
              <AdSlot placement="listInFeed" />
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );
}
