import type { TechStack } from '@jinho-blog/shared';
import type { ComponentProps, PropsWithChildren } from 'react';

import Image from 'next/image';

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
  createdAt: string;
  thumbnail?: string;
  showThumbnail?: boolean;
};

function Card({ href, className, category, createdAt, thumbnail, showThumbnail, children, ...props }: CardProps) {
  const contentName = href.toString().split('/').pop();

  return (
    <LinkButton
      href={href}
      className={cn(
        `
          group size-full overflow-hidden rounded-2xl drop-shadow-lg drop-shadow-black/5
          hover:scale-103
        `,
        className,
      )}
      {...props}
    >
      {/* 썸네일 */}
      <Show when={showThumbnail}>
        <div className="flex-col-center aspect-video w-full justify-center overflow-hidden bg-gray-2">
          <Show
            when={thumbnail}
            fallback={<span className="font-caption-14 text-gray-4">No Image</span>}
          >
            {thumbnail => (
              <Image
                className="w-full object-cover"
                src={thumbnail}
                alt={`thumbnail-${category}-${contentName}`}
                width="640"
                height="360"
                priority={false}
                preload={false}
              />
            )}
          </Show>
        </div>
      </Show>

      <article
        className={`
          flex-col-start w-full gap-1.5 bg-background p-5 text-foreground animated-150
          group-hover:bg-blue-6
          dark:group-hover:bg-blue-5
          light:group-hover:text-background
        `}
      >
        {/* 카테고리, 작성일 */}
        <div className="flex-row-center w-full justify-between opacity-70">
          <p className="font-caption-14">{category}</p>
          <Show when={createdAt}>
            {createdAt => <time className="font-body-14">{formatDateToString(createdAt)}</time>}
          </Show>
        </div>

        {/* 정보 */}
        {children}
      </article>
    </LinkButton>
  );
}

type BlogInfoProps = {
  title: string;
  description: string;
};

function BlogInfo({ title, description }: BlogInfoProps) {
  return (
    <div className="flex-col-start gap-1.5">
      {/* 제목 */}
      <h2 className="mb-1.5 font-subtitle-20">{title}</h2>

      {/* 설명 */}
      <p className="font-body-14 leading-snug opacity-70">{description}</p>
    </div>
  );
}

type ProjectInfoProps = {
  title: string;
  period: string;
  members: string;
  description: string;
};

function ProjectInfo({ title, period, members, description }: ProjectInfoProps) {
  return (
    <div className="flex-col-start gap-1.5">
      {/* 제목 */}
      <h2 className="mb-1.5 font-subtitle-20">{title}</h2>

      {/* 기간, 인원 */}
      <p className="font-body-14 leading-snug opacity-70">
        <span>{period}</span>
        <span className="mx-1.5">|</span>
        <span>{members}</span>
      </p>

      {/* 설명 */}
      <p className="font-body-14 leading-snug opacity-70">{description}</p>
    </div>
  );
}

type LibraryInfoProps = {
  title: string;
  description: string;
};

function LibraryInfo({ title, description }: LibraryInfoProps) {
  return (
    <div className="flex-col-start gap-1.5">
      {/* 제목 */}
      <h2 className="mb-1.5 font-subtitle-20">{title}</h2>

      {/* 설명 */}
      <p className="font-body-14 leading-snug opacity-70">{description}</p>
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
