import type { Post } from '@/entities/post';

import Image from 'next/image';
import Link from 'next/link';

import { CATEGORY_MAP } from '@/core/config';
import { formatDate } from '@/core/utils';

type Props = {
  post: Post;
  /** 목록 위치에 맞는 제목 단계 (페이지 h1 바로 아래 → 2, h2 섹션 안 → 3) */
  headingLevel?: 2 | 3;
  /** 첫 화면에 보이는 카드: 지연 로딩 대신 우선 로딩 (LCP 개선) */
  priority?: boolean;
};

/**
 * 글 카드
 * - 썸네일은 16:9 영역에 채워 레이아웃 이동(CLS) 방지
 * - 제목 링크를 카드 전체로 확장 (카드 내 링크는 하나 — 스크린 리더 중복 낭독 방지)
 * - 썸네일은 제목과 같은 정보라 장식 이미지로 처리 (alt="")
 */
export function PostCard({ post, headingLevel = 2, priority = false }: Props) {
  const Heading = `h${headingLevel}` as const;

  return (
    <article
      className={`
        group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background
        transition-colors
        hover:border-muted
        has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent
      `}
    >
      {/* 썸네일이 없어도 같은 영역을 유지해 카드 높이 통일 */}
      <div className="relative aspect-video overflow-hidden border-b border-border bg-surface">
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold text-accent">{CATEGORY_MAP[post.category].name}</p>
        <Heading className="text-lg/snug font-semibold text-balance">
          <Link
            href={post.path}
            className={`
              underline-offset-4 outline-none
              group-hover:underline
              after:absolute after:inset-0
            `}
          >
            {post.title}
          </Link>
        </Heading>
        <p className="line-clamp-2 text-sm text-muted">{post.description}</p>
        <time
          dateTime={post.createdAt}
          className="mt-auto pt-2 text-xs text-muted"
        >
          {formatDate(post.createdAt)}
        </time>
      </div>
    </article>
  );
}
