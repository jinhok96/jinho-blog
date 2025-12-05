import type { TechStack } from '@/core/types/internal';

import { TechBadge } from '@/core/ui/badge';
import { Show } from '@/core/ui/wrapper';
import { formatDateToString } from '@/core/utils/internal';

type Props = {
  category: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tech?: TechStack[];
};

export function ContentHeader({ category, title, createdAt, updatedAt, tech }: Props) {
  return (
    <div className="mb-10 flex-col-start gap-3">
      <div>
        <p className="mb-2 font-caption-16 text-gray-5">{category}</p>
        <h1 className="font-title-40">{title}</h1>
      </div>

      <div className="flex-row-center w-full gap-3 font-body-14 text-gray-5">
        <time>작성일: {formatDateToString(createdAt)}</time>
        <time>수정일: {formatDateToString(updatedAt)}</time>
      </div>

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
  );
}
