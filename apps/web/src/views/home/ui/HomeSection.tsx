import type { PropsWithChildren } from 'react';

import { cn } from '@/core/utils';

type HomeSectionProps = PropsWithChildren<{
  className?: string;
  innerClassName?: string;
}>;

export function HomeSection({ children, className, innerClassName }: HomeSectionProps) {
  return (
    <section className={cn('w-full px-layout', className)}>
      <div className={cn('container mx-auto my-layout flex-col-center size-full gap-8', innerClassName)}>
        {children}
      </div>
    </section>
  );
}
