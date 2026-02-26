'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import { TECH_STACK_MAP, type TechStack } from '@jinho-blog/shared';

import { TECH_STACK_IMAGE_MAP } from '@/core/constants';
import { useOutsideClickEffect, useTimeoutRef } from '@/core/hooks';
import { cn } from '@/core/utils';

const VISIBLE_TIMEOUT = 3000;

const getStackImageSrc = (tech: TechStack) => `/images/stacks/${TECH_STACK_IMAGE_MAP[tech]}`;

type Props = {
  className?: string;
  tech: TechStack;
};

export function TechStackBadge({ className, tech }: Props) {
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

  const src = getStackImageSrc(tech);

  return (
    <div className={cn('@container relative', className)}>
      {/* 아이콘 */}
      <div
        className={`
          peer aspect-square w-full overflow-hidden rounded-md bg-background p-1 shadow-md
          @min-[2.5rem]:rounded-lg @min-[2.5rem]:p-1.5
          @min-[3rem]:p-2
          dark:bg-foreground-2
        `}
        onClick={handleImageClick}
        ref={ref}
      >
        <Image
          src={src}
          alt={TECH_STACK_MAP[tech]}
          width={100}
          height={100}
          className="object-contain"
        />
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
