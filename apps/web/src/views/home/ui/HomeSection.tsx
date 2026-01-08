import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';

import { Show } from '@/core/ui';
import { cn } from '@/core/utils';

type HomeSectionProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  innerClassName?: string;
};

export function HomeSection({ children, className, innerClassName, ...props }: HomeSectionProps) {
  return (
    <section
      className={cn('w-full scroll-m-[calc(var(--height-header)+1.5rem)] py-18 px-layout', className)}
      {...props}
    >
      <div className={cn('container mx-auto flex-col-center size-full gap-10', innerClassName)}>{children}</div>
    </section>
  );
}

type HeaderProps = PropsWithChildren<{
  label: string;
}>;

function Header({ label, children }: HeaderProps) {
  return (
    <div className="flex-col-center w-full gap-2 text-center">
      <p className="w-full font-subtitle-16 text-blue-7">{label}</p>

      <Show when={children}>
        <div className="font-subtitle-24">{children}</div>
      </Show>
    </div>
  );
}

HomeSection.Header = Header;
