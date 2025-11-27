'use client';

import type { ButtonProps } from '@/core/ui/button/types';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { buttonVariants } from '@/core/ui/button/const';
import { cn } from '@/core/utils';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonProps;

export function Button({ className, size, children, color, disableHover, rounded, ...props }: Props) {
  return (
    <button
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
    </button>
  );
}
