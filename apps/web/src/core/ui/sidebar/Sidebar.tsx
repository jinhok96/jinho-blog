'use client';

import { type PropsWithChildren } from 'react';

import { cn } from '@/core/utils';

type Props = PropsWithChildren<{
  className?: string;
  isShow: boolean;
}>;

export function Sidebar({ className, isShow, children }: Props) {
  return (
    <>
      <aside
        className={cn(
          `
            pointer-events-none fixed top-0 left-0 z-drawer-under-header flex-col-start h-screen w-full shrink-0
            overflow-hidden bg-background pt-header shadow-xl animated-150
            not-desktop:dark:bg-gray-1
          `,
          !isShow && 'not-desktop:-translate-x-2/3 not-desktop:opacity-0',
          className,
        )}
      >
        <div className="pointer-events-auto flex-col-start size-full flex-1 overflow-auto p-layout-x">{children}</div>
      </aside>

      {/* 사이드바 - 더미*/}
      <div className={cn('not-desktop:hidden', className)} />
    </>
  );
}
