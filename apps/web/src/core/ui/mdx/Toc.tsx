'use client';

import type { TocItem } from 'remark-flexible-toc';

import { useEffect, useState } from 'react';

import { LinkButton } from '@/core/ui/button';
import { cn } from '@/core/utils';

const depthClassNameMap: Record<TocItem['depth'], string> = {
  1: 'pl-0',
  2: 'pl-0',
  3: 'pl-2',
  4: 'pl-4',
  5: 'pl-6',
  6: 'pl-8',
};

type TocProps = {
  toc?: TocItem[];
};

export function Toc({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!toc?.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: '0px 0px -90% 0px',
        threshold: 0,
      },
    );

    const headingElements = toc
      .map(item => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    headingElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="max-w-52 pt-7 pl-10 font-caption-14 text-gray-5">
      <p className="mb-4 text-foreground">목차</p>

      <ul className="flex-col-start gap-1">
        {toc?.map(item => (
          <li key={item.href}>
            <LinkButton
              href={item.href}
              className={cn(
                `
                  py-1 transition-colors
                  hover:text-gray-8
                `,
                depthClassNameMap[item.depth],
                activeId === item.href && 'text-blue-7',
              )}
            >
              {item.value}
            </LinkButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
