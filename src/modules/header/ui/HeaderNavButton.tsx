'use client';

import { type ComponentProps, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { LinkButton } from '@/core/ui';
import { cn } from '@/core/utils';

type Props = Omit<ComponentProps<typeof LinkButton>, 'color' | 'size' | 'className'>;

export function HeaderNavButton({ href, children, ...props }: Props) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(pathname.startsWith(href));
  }, [pathname, href]);

  return (
    <LinkButton
      href={href}
      color="background"
      size="md"
      className={cn(isActive && 'underline underline-offset-2')}
      {...props}
    >
      {children}
    </LinkButton>
  );
}
