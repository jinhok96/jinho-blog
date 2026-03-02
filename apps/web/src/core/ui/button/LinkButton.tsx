'use client';

import type { ButtonProps } from '@/core/ui/button/types';
import type { ComponentProps, TouchEventHandler } from 'react';

import Link from 'next/link';

import { usePressable } from '@/core/hooks';
import { buttonVariants } from '@/core/ui/button/variants';
import { cn, stringifyURL } from '@/core/utils';

type Props = ComponentProps<typeof Link> &
  ButtonProps & {
    hard?: boolean;
  };

export function LinkButton({
  className,
  href,
  hard,
  download,
  size,
  color,
  variant,
  children,
  disableHover,
  rounded,
  disabled,
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

  const variants = buttonVariants({
    variant,
    color,
    size,
    rounded,
    disableHover,
    disabled,
  });

  const buttonClassNames = cn(variants, className, pressable.isPressed && 'touch:scale-95');

  if (hard || download) {
    const hrefString = stringifyURL(href);

    return (
      <a
        className={buttonClassNames}
        href={hrefString}
        download={download}
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
      className={buttonClassNames}
      href={href}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...props}
    >
      {children}
    </Link>
  );
}
