import type { BadgeProps } from '@/core/ui/badge/types';

import { cn } from '@/core/utils/internal';

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn('rounded-lg px-3 py-1.5 font-caption-14', className)}
      {...props}
    >
      {children}
    </span>
  );
}
