'use client';

import { type ComponentProps, type TouchEventHandler } from 'react';
import Link from 'next/link';

import { usePressable } from '@/core/hooks';
import { cn, stringifyURL } from '@/core/utils';

type Props = ComponentProps<typeof Link> & {
  hard?: boolean;
};

export function PressableLink({
  className,
  children,
  href,
  hard,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
  ...props
}: Props) {
  const pressable = usePressable();

  const handleTouchStart: TouchEventHandler<HTMLAnchorElement> = e => {
    pressable.start();
    onTouchStart?.(e);
  };

  const handleTouchEnd: TouchEventHandler<HTMLAnchorElement> = e => {
    pressable.end();
    onTouchEnd?.(e);
  };

  const handleTouchCancel: TouchEventHandler<HTMLAnchorElement> = e => {
    pressable.end();
    onTouchCancel?.(e);
  };

  if (hard) {
    // 이미 LinkButton에서 처리되고 있지만, 독립적으로도 작동할 수 있게 처리
    const hrefString = stringifyURL(href);

    return (
      <a
        href={hrefString}
        className={cn(className, pressable.isPressed && 'scale-95')}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(className, pressable.isPressed && 'scale-95')}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...props}
    >
      {children}
    </Link>
  );
}
