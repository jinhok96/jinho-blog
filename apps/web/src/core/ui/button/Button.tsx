'use client';

import type { ButtonProps } from '@/core/ui/button/types';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { PressableButton } from '@/core/ui/button/PressableButton';
import { buttonVariants } from '@/core/ui/button/variants';
import { cn } from '@/core/utils';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonProps;

export function Button({
  className,
  size,
  children,
  color,
  variant,
  disableHover,
  rounded,
  disabled,
  ...props
}: Props) {
  const variants = buttonVariants({
    variant,
    color,
    size,
    rounded,
    disableHover,
    disabled,
  });

  return (
    <>
      <button
        className={cn(variants, className, 'hover-none:hidden')}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
      <PressableButton
        className={cn(variants, className, 'not-hover-none:hidden')}
        disabled={disabled}
        {...props}
      >
        {children}
      </PressableButton>
    </>
  );
}
