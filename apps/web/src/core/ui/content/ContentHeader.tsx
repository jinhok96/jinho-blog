import type { TechStack } from '@jinho-blog/shared';
import type { PropsWithChildren } from 'react';

import { TechStackBadge } from '@/core/ui/badge';
import { LinkButton } from '@/core/ui/button';
import { Show } from '@/core/ui/wrapper';
import { cn, formatDateToString } from '@/core/utils';

type Props = PropsWithChildren<{
  category: string;
  title: string;
  isModalView?: boolean;
}>;

export function ContentHeader({ children, category, title, isModalView }: Props) {
  return (
    <div className="mb-6 flex-col-start w-full gap-3 border-b border-gray-2 pb-6">
      <p className="font-caption-16 text-gray-5">{category}</p>

      <h1 className={cn('mb-2 font-title-40', isModalView && 'font-title-32')}>{title}</h1>

      {children}
    </div>
  );
}

type DateProps = {
  createdAt: string;
  updatedAt: string;
};

function Date({ createdAt, updatedAt }: DateProps) {
  const formattedCreatedAt = formatDateToString(createdAt);
  const formattedUpdatedAt = formatDateToString(updatedAt);

  return (
    <div className="flex-row-center w-full gap-3 font-body-14 text-gray-5">
      <time>작성일: {formattedCreatedAt}</time>
      <time>수정일: {formattedUpdatedAt}</time>
    </div>
  );
}

type InfoProps = PropsWithChildren<{
  label: string;
}>;

function Info({ label, children }: InfoProps) {
  return (
    <div className="flex-col-start gap-1 font-body-14 leading-snug">
      <p className="text-gray-5">{label}</p>
      <div>{children}</div>
    </div>
  );
}

type ProjectInfoProps = {
  period: string;
  members: string;
  description: string;
  links?: string[];
};

function ProjectInfo({ period, members, description, links }: ProjectInfoProps) {
  return (
    <>
      <Info label="프로젝트 설명">{description}</Info>
      <Info label="기간">{period}</Info>
      <Info label="팀원">{members}</Info>

      <Show when={links}>
        {list => (
          <Info label="관련 링크">
            <ul className="flex-col-start list-disc gap-1 pl-5">
              {list.map(link => (
                <li key={link}>
                  <LinkButton
                    href={link}
                    target="_blank"
                    className="underline underline-offset-2"
                  >
                    {link}
                  </LinkButton>
                </li>
              ))}
            </ul>
          </Info>
        )}
      </Show>
    </>
  );
}

type TechStacksProps = {
  stacks: TechStack[];
};

function TechStacks({ stacks }: TechStacksProps) {
  return (
    <div className="flex-row-center flex-wrap gap-2 pt-2.5 pb-1">
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

ContentHeader.Date = Date;
ContentHeader.ProjectInfo = ProjectInfo;
ContentHeader.TechStacks = TechStacks;
