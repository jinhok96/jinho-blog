import type { AdjacentPosts, Post } from '@/entities/post';

import Link from 'next/link';

import { cn } from '@/core/utils';

type AdjacentLinkProps = {
  post: Post;
  label: string;
  className?: string;
};

function AdjacentLink({ post, label, className }: AdjacentLinkProps) {
  return (
    <Link
      href={post.path}
      className={cn(
        `
          flex h-full flex-col gap-1 rounded-lg border border-border p-4 transition-colors
          hover:border-muted hover:bg-surface
        `,
        className,
      )}
    >
      <span className="text-xs text-muted">{label}</span>
      <span className="font-medium text-balance">{post.title}</span>
    </Link>
  );
}

type Props = AdjacentPosts;

/**
 * 이전 글(더 오래된 글)·다음 글(더 최신 글) 이동
 */
export function AdjacentPostNav({ previous, next }: Props) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="이전 글과 다음 글"
      className={`
        grid gap-3
        sm:grid-cols-2
      `}
    >
      {previous && (
        <AdjacentLink
          post={previous}
          label="← 이전 글"
        />
      )}
      {next && (
        <AdjacentLink
          post={next}
          label="다음 글 →"
          className="sm:col-start-2 sm:text-right"
        />
      )}
    </nav>
  );
}
