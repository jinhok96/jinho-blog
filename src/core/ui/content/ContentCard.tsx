import type { TechStack } from '@/core/types';

import { TechBadge } from '@/core/ui/badge';
import { LinkButton } from '@/core/ui/button';
import { Show } from '@/core/ui/wrapper';
import { formatDateToString } from '@/core/utils';

type Props = {
  href: string;
  category: string;
  title: string;
  description: string;
  createdAt: string;
  tech?: TechStack[];
};

export function ContentCard({ href, category, title, description, createdAt, tech }: Props) {
  return (
    <LinkButton
      href={href}
      className="size-full rounded-2xl bg-gray-1 p-5"
    >
      <div className="flex-col-start w-full gap-2">
        {/* 카테고리, 작성일 */}
        <div className="flex-row-center w-full justify-between text-gray-5">
          <p className="font-caption-14">{category}</p>
          <time className="font-body-14">{formatDateToString(createdAt)}</time>
        </div>

        {/* 제목 */}
        <h2 className="font-subtitle-24">{title}</h2>

        {/* 설명 */}
        <p className="font-body-14">{description}</p>

        {/* 테크스택 */}
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
      </div>
    </LinkButton>
  );
}
