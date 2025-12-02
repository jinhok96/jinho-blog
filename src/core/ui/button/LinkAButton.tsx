'use client';

import type { ButtonProps } from '@/core/ui/button/types';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

import { buttonVariants } from '@/core/ui/button/variants';
import { cn } from '@/core/utils';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonProps & PropsWithChildren<{ className?: string }>;

export function LinkAButton({ className, size, color, variant, children, disableHover, rounded, disabled, ...props }: Props) {
  return (
    <a
      className={cn(
        buttonVariants({
          variant,
          color,
          size,
          rounded,
          disableHover,
          disabled,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
