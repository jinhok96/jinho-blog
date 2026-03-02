'use client';

import type { ButtonProps } from '@/core/ui/button/types';
import type { ButtonHTMLAttributes, DetailedHTMLProps, TouchEventHandler } from 'react';

import { usePressable } from '@/core/hooks';
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
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
  ...props
}: Props) {
  const pressable = usePressable();

  const handleTouchStart: TouchEventHandler<HTMLButtonElement> = e => {
    pressable.start();
    onTouchStart?.(e);
  };

  const handleTouchEnd: TouchEventHandler<HTMLButtonElement> = e => {
    pressable.end();
    onTouchEnd?.(e);
  };

  const handleTouchCancel: TouchEventHandler<HTMLButtonElement> = e => {
    pressable.end();
    onTouchCancel?.(e);
  };

  const variants = buttonVariants({
    variant,
    color,
    size,
    rounded,
    disableHover,
    disabled,
  });

  return (
    <button
      className={cn(variants, className, pressable.isPressed && 'touch:scale-95')}
      disabled={disabled}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...props}
    >
      {children}
    </button>
  );
}
