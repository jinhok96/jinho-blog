'use client';

import type { ButtonProps } from '@/core/ui/button/types';
import type { LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

import Link from 'next/link';

import { buttonVariants } from '@/core/ui/button/variants';
import { cn } from '@/core/utils';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps &
  ButtonProps &
  PropsWithChildren<{ className?: string }>;

export function LinkButton({ className, size, color, variant, children, disableHover, rounded, disabled, ...props }: Props) {
  return (
    <Link
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
      {...props}
    >
      {children}
    </Link>
  );
}
