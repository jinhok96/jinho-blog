import type { ButtonProps } from '@/core/ui/button/types';
import type { ComponentProps } from 'react';

import Link from 'next/link';

import { PressableLink } from '@/core/ui/button/PressableLink';
import { buttonVariants } from '@/core/ui/button/variants';
import { cn } from '@/core/utils';

type Props = ComponentProps<typeof Link> & ButtonProps;

export function LinkButton({
  className,
  size,
  color,
  variant,
  children,
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
      <Link
        className={cn(variants, className, 'hover-none:hidden')}
        {...props}
      >
        {children}
      </Link>
      <PressableLink
        className={cn(variants, className, 'not-hover-none:hidden')}
        {...props}
      >
        {children}
      </PressableLink>
    </>
  );
}
