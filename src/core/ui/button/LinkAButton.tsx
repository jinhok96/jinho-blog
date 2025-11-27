'use client';

import type { ButtonProps } from '@/core/ui/button/types';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

import { buttonVariants } from '@/core/ui/button/const';
import { cn } from '@/core/utils';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonProps & PropsWithChildren<{ className?: string }>;

export function LinkAButton({ className, size, color, children, disableHover, rounded, ...props }: Props) {
  return (
    <a
      className={cn(
        buttonVariants({
          size,
          color,
          colorHover: disableHover ? null : color,
          rounded,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
