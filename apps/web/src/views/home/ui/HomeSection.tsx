import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import { cn } from '@/core/utils';

type HomeSectionProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  innerClassName?: string;
};

export function HomeSection({ children, className, innerClassName, ...props }: HomeSectionProps) {
  return (
    <section
      className={cn('w-full scroll-m-[calc(var(--height-header)+6rem)] px-layout', className)}
      {...props}
    >
      <div className={cn('container mx-auto my-layout flex-col-center size-full gap-8', innerClassName)}>
        {children}
      </div>
    </section>
  );
}
