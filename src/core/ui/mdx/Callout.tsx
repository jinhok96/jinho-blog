import type { PropsWithChildren } from 'react';

import { cn } from '@/core/utils';

type Props = PropsWithChildren<{ className?: string }>;

export default function Callout({ children, className, ...props }: Props) {
  return (
    <div
      className={cn('size-full overflow-hidden rounded-2xl bg-gray-1 pb-2', className)}
      {...props}
    >
      <div className="scrollbar-margin-2.5 size-full overflow-auto p-5 pb-3">{children}</div>
    </div>
  );
}
