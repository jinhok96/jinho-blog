import type { Post } from '@/entities/post';

import Link from 'next/link';

import { CATEGORY_MAP } from '@/core/config';
import { categoryPath } from '@/core/routes';
import { formatDate, getReadingMinutes, isSameDate } from '@/core/utils';

type Props = {
  post: Post;
};

/**
 * 글 제목 영역: 초안 배지, `<h1>`, 요약, 메타 정보(발행일·수정일·읽는 시간·카테고리)
 */
export function PostHeader({ post }: Props) {
  const { title, description, category, createdAt, updatedAt, draft, content } = post;
  const isUpdated = !isSameDate(createdAt, updatedAt);

  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6">
      {/* 초안은 개발 서버에서만 노출되므로 배포 결과에는 나타나지 않음 */}
      {draft && (
        <p>
          <span
            className={`
              inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900
              dark:bg-amber-900 dark:text-amber-100
            `}
          >
            초안
          </span>
        </p>
      )}

      <h1
        className={`
          text-3xl/tight font-bold tracking-tight text-balance
          sm:text-4xl/tight
        `}
      >
        {title}
      </h1>
      <p
        className={`
          text-lg text-pretty text-muted
          sm:text-xl
        `}
      >
        {description}
      </p>

      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <div className="flex gap-1.5">
          <dt className="text-muted">발행일</dt>
          <dd>
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </dd>
        </div>
        {isUpdated && (
          <div className="flex gap-1.5">
            <dt className="text-muted">수정일</dt>
            <dd>
              <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
            </dd>
          </div>
        )}
        <div className="flex gap-1.5">
          <dt className="text-muted">읽는 시간</dt>
          <dd>약 {getReadingMinutes(content)}분</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-muted">카테고리</dt>
          <dd>
            <Link
              href={categoryPath(category)}
              className={`
                font-medium text-accent underline-offset-4
                hover:underline
              `}
            >
              {CATEGORY_MAP[category].name}
            </Link>
          </dd>
        </div>
      </dl>
    </header>
  );
}
