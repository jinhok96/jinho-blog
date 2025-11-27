'use client';

import type { ButtonProps } from '@/core/ui/button/types';
import type { LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

import Link from 'next/link';

import { buttonVariants } from '@/core/ui/button/const';
import { cn } from '@/core/utils';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps &
  ButtonProps &
  PropsWithChildren<{ className?: string }>;

export function LinkButton({ className, size, color, children, disableHover, rounded, ...props }: Props) {
  return (
    <Link
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
    </Link>
  );
}
