'use client';

import { type ComponentProps } from 'react';
import Link from 'next/link';

import { usePressable } from '@/core/hooks';
import { cn } from '@/core/utils';

type Props = ComponentProps<typeof Link>;

export function PressableLink({ className, children, onTouchStart, onTouchEnd, onTouchCancel, ...props }: Props) {
  const pressable = usePressable();

  return (
    <Link
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
    </Link>
  );
}
