'use client';

import { type ButtonHTMLAttributes, type DetailedHTMLProps, type TouchEventHandler } from 'react';

import { usePressable } from '@/core/hooks';
import { cn } from '@/core/utils';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function PressableButton({ className, children, onTouchStart, onTouchEnd, onTouchCancel, ...props }: Props) {
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

  return (
    <button
      className={cn(className, pressable.isPressed && 'scale-95')}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...props}
    >
      {children}
    </button>
  );
}
