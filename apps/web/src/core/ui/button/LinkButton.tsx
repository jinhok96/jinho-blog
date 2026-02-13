import type { ButtonProps } from '@/core/ui/button/types';
import type { ComponentProps } from 'react';

import Link from 'next/link';

import { PressableLink } from '@/core/ui/button/PressableLink';
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

  if (hard || download) {
    const hrefString = stringifyURL(href);

    return (
      <>
        <a
          className={cn(variants, className, 'touch:hidden')}
          href={hrefString}
          download={download}
          {...props}
        >
          {children}
        </a>
        <PressableLink
          className={cn(variants, className, 'not-touch:hidden')}
          href={hrefString}
          hard
          {...props}
        >
          {children}
        </PressableLink>
      </>
    );
  }

  return (
    <>
      <Link
        className={cn(variants, className, 'touch:hidden')}
        href={href}
        {...props}
      >
        {children}
      </Link>
      <PressableLink
        className={cn(variants, className, 'not-touch:hidden')}
        href={href}
        {...props}
      >
        {children}
      </PressableLink>
    </>
  );
}
