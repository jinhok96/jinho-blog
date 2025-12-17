'use client';

import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react';

import { usePressable } from '@/core/hooks';
import { cn } from '@/core/utils';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function PressableButton({ className, children, onTouchStart, onTouchEnd, onTouchCancel, ...props }: Props) {
  const pressable = usePressable();

  return (
    <button
      className={cn(className, pressable.isPressed && 'scale-95')}
      onTouchStart={e => {
        pressable.start();
        onTouchStart?.(e);
      }}
      onTouchEnd={e => {
        pressable.end();
        onTouchEnd?.(e);
      }}
      onTouchCancel={e => {
        pressable.end();
        onTouchCancel?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
