import type { TechStack } from '@jinho-blog/shared';
import type { ComponentProps, PropsWithChildren } from 'react';

import { TechStackBadge } from '@/core/ui/badge';
import { LinkButton } from '@/core/ui/button';
import { Show } from '@/core/ui/wrapper';
import { cn, formatDateToString } from '@/core/utils';

export function ContentCardSection({ children }: PropsWithChildren) {
  return (
    <div
      className={`
        flex-col-center size-full grid-cols-2 gap-4
        tablet:grid
        desktop:grid-cols-3
      `}
    >
      {children}
    </div>
  );
}

type CardProps = ComponentProps<typeof LinkButton> & {
  category: string;
  title: string;
  description: string;
  createdAt: string;
};

function Card({ href, className, category, title, description, createdAt, children, ...props }: CardProps) {
  return (
    <LinkButton
      href={href}
      className={cn(
        `
          size-full rounded-2xl bg-background p-5 text-foreground
          hover:scale-103 hover:bg-blue-6
          dark:hover:bg-blue-5
          light:hover:text-background
        `,
        className,
      )}
      {...props}
    >
      <article className="flex-col-start w-full gap-0.5">
        {/* 카테고리, 작성일 */}
        <div className="flex-row-center w-full justify-between opacity-70">
          <p className="font-caption-14">{category}</p>
          <time className="font-body-14">{formatDateToString(createdAt)}</time>
        </div>

        {/* 제목 */}
        <h2 className="mb-1 font-subtitle-20">{title}</h2>

        {/* 설명 */}
        <p className="py-1 font-body-14 opacity-70">{description}</p>

        {/* 추가 요소 */}
        {children}
      </article>
    </LinkButton>
  );
}

type TechBadgeListProps = { tech: TechStack[] };

function TechBadgeList({ tech }: TechBadgeListProps) {
  return (
    <Show when={tech}>
      {list => (
        <div className="flex-row-center flex-wrap gap-2 py-3">
          {list.map(item => (
            <TechStackBadge
              key={item}
              tech={item}
              className="size-8"
            />
          ))}
        </div>
      )}
    </Show>
  );
}

function Placeholder() {
  return <div className="size-full pt-24 text-center font-caption-14 text-gray-4">작성글이 없습니다.</div>;
}

ContentCardSection.Card = Card;
ContentCardSection.TechBadgeList = TechBadgeList;
ContentCardSection.Placeholder = Placeholder;
