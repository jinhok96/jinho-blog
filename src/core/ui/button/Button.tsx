'use client';

import type { ButtonProps } from '@/core/ui/button/types';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { buttonVariants } from '@/core/ui/button/variants';
import { cn } from '@/core/utils';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonProps;

export function Button({ className, size, children, color, variant, disableHover, rounded, disabled, ...props }: Props) {
  return (
    <button
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
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
