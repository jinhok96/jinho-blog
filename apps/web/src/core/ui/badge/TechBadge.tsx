'use client';

import type { TechStack } from '@jinho-blog/shared';

import { useRef, useState } from 'react';

import { useOutsideClickEffect, useTimeoutRef } from '@/core/hooks';
import { TECH_STACK_MAP } from '@/core/map';
import { cn } from '@/core/utils';

const VISIBLE_TIMEOUT = 3000;

type Props = {
  className?: string;
  tech: TechStack;
};

export function TechBadge({ className, tech }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeout = useTimeoutRef();

  const handleImageClick = () => {
    setIsVisible(true);
    timeout.set(() => setIsVisible(false), VISIBLE_TIMEOUT);
  };

  useOutsideClickEffect(() => {
    setIsVisible(false);
  }, [ref]);

  return (
    <div className={cn('relative', className)}>
      {/* 아이콘 */}
      <div
        className="peer aspect-square w-full overflow-hidden rounded-md bg-foreground-2"
        onClick={handleImageClick}
        ref={ref}
      >
        {/* Icon */}
      </div>

      {/* 라벨 */}
      <div
        className={cn(
          `
            pointer-events-none absolute bottom-full left-1/2 mb-2 size-fit -translate-x-1/2 rounded-lg bg-foreground-7
            px-2 py-1 text-center align-text-bottom font-body-14 leading-tight text-background opacity-0
            backdrop-blur-sm select-none animated-100
            peer-hover:opacity-100
            dark:font-medium
          `,
          isVisible && 'touch:opacity-100',
        )}
      >
        {TECH_STACK_MAP[tech]}
      </div>
    </div>
  );
}
