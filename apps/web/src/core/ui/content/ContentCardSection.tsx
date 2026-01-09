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
  createdAt: string;
};

function Card({ href, className, category, title, createdAt, children, ...props }: CardProps) {
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
      <article className="flex-col-start w-full gap-1.5">
        {/* 카테고리, 작성일 */}
        <div className="flex-row-center w-full justify-between opacity-70">
          <p className="font-caption-14">{category}</p>
          <Show when={createdAt}>
            {createdAt => <time className="font-body-14">{formatDateToString(createdAt)}</time>}
          </Show>
        </div>

        {/* 제목 */}
        <h2 className="mb-1.5 font-subtitle-20">{title}</h2>

        {/* 정보 */}
        {children}
      </article>
    </LinkButton>
  );
}

type BlogInfoProps = {
  description: string;
};

function BlogInfo({ description }: BlogInfoProps) {
  return (
    <div className="flex-col-start gap-1.5 font-body-14 leading-snug opacity-70">
      {/* 설명 */}
      <p>{description}</p>
    </div>
  );
}

type ProjectInfoProps = {
  period: string;
  members: string;
  description: string;
};

function ProjectInfo({ period, members, description }: ProjectInfoProps) {
  return (
    <div className="flex-col-start gap-1.5 font-body-14 leading-snug opacity-70">
      {/* 기간, 인원 */}
      <p>
        <span>{period}</span>
        <span className="mx-1.5">|</span>
        <span>{members}</span>
      </p>

      {/* 설명 */}
      <p>{description}</p>
    </div>
  );
}

type LibraryInfoProps = {
  description: string;
};

function LibraryInfo({ description }: LibraryInfoProps) {
  return (
    <div className="flex-col-start gap-1.5 font-body-14 leading-snug opacity-70">
      {/* 설명 */}
      <p>{description}</p>
    </div>
  );
}

type TechStacksProps = { stacks: TechStack[] };

function TechStacks({ stacks }: TechStacksProps) {
  return (
    <div className="flex-row-center flex-wrap gap-1.5 pt-3 pb-2">
      {stacks.map(item => (
        <TechStackBadge
          key={item}
          tech={item}
          className="size-7"
        />
      ))}
    </div>
  );
}

function Placeholder() {
  return <div className="size-full pt-24 text-center font-caption-14 text-gray-4">작성글이 없습니다.</div>;
}

ContentCardSection.Card = Card;
ContentCardSection.BlogInfo = BlogInfo;
ContentCardSection.ProjectInfo = ProjectInfo;
ContentCardSection.LibraryInfo = LibraryInfo;
ContentCardSection.TechStacks = TechStacks;
ContentCardSection.Placeholder = Placeholder;
