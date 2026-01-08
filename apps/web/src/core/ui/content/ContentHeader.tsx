import type { TechStack } from '@jinho-blog/shared';

import { TechStackBadge } from '@/core/ui/badge';
import { Show } from '@/core/ui/wrapper';
import { cn, formatDateToString } from '@/core/utils';

type Props = {
  category: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tech?: TechStack[];
  isModalView?: boolean;
};

export function ContentHeader({ category, title, createdAt, updatedAt, tech, isModalView }: Props) {
  return (
    <div className="flex-col-start w-full gap-3 border-b border-gray-2 pb-6">
      <p className="font-caption-16 text-gray-5">{category}</p>

      <h1 className={cn('font-title-40', isModalView && 'font-title-32')}>{title}</h1>

      <div className="flex-row-center w-full gap-3 font-body-14 text-gray-5">
        <time>작성일: {formatDateToString(createdAt)}</time>
        <time>수정일: {formatDateToString(updatedAt)}</time>
      </div>

      <Show when={tech}>
        {list => (
          <div className="flex-row-center flex-wrap gap-2 py-2">
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
    </div>
  );
}
