import type { TechStack } from '@jinho-blog/shared';
import type { ComponentProps, PropsWithChildren } from 'react';

import { TechBadge } from '@/core/ui/badge';
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
          size-full rounded-2xl bg-gray-1 p-5
          hover:scale-103 hover:bg-blue-1
          light:hover:drop-shadow-md
        `,
        className,
      )}
      {...props}
    >
      <article className="flex-col-start w-full gap-2">
        {/* 카테고리, 작성일 */}
        <div className="flex-row-center w-full justify-between text-gray-5">
          <p className="font-caption-14">{category}</p>
          <time className="font-body-14">{formatDateToString(createdAt)}</time>
        </div>

        {/* 제목 */}
        <h2 className="font-subtitle-20">{title}</h2>

        {/* 설명 */}
        <p className="py-0.5 font-body-14 text-gray-5">{description}</p>

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
            <TechBadge
              key={item}
              tech={item}
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
