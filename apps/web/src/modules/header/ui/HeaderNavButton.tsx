'use client';

import type { ComponentProps } from 'react';

import { usePathname } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';

import { LinkButton } from '@/core/ui';
import { cn } from '@/core/utils';

type Props = Omit<ComponentProps<typeof LinkButton>, 'color' | 'size' | 'className' | 'href'> & { href: string };

export function HeaderNavButton({ href, children, ...props }: Props) {
  const pathname = usePathname();

  const isActive =
    href === routes({ pathname: '/' }) ? pathname === routes({ pathname: '/' }) : pathname.startsWith(href);

  return (
    <LinkButton
      href={href}
      color="background"
      size="md"
      className={cn('not-tablet:px-2', isActive && 'underline underline-offset-2')}
      {...props}
    >
      {children}
    </LinkButton>
  );
}
