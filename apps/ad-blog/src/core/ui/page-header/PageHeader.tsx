import type { ReactNode } from 'react';

import { cn } from '@/core/utils';

type Props = {
  /** 페이지 `<h1>` (페이지당 하나) */
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

/**
 * 목록·정적 페이지 제목 영역
 */
export function PageHeader({ title, description, className }: Props) {
  return (
    <header className={cn('flex flex-col gap-2', className)}>
      <h1
        className={`
          text-2xl font-bold tracking-tight text-balance
          sm:text-3xl
        `}
      >
        {title}
      </h1>
      {description && <p className="text-pretty text-muted">{description}</p>}
    </header>
  );
}
