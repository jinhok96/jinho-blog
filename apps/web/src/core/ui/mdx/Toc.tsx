'use client';

import type { TocItem } from 'remark-flexible-toc';

import { useEffect as useLayoutEffect, useState } from 'react';

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
  const [activeId, setActiveId] = useState('');

  useLayoutEffect(() => {
    if (!toc?.length) return;
    if (!window?.innerHeight) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: `-64px 0px -${window.innerHeight - 80}px 0px`,
        threshold: 0,
      },
    );

    const headingElements = toc.map(item => document.querySelector(item.href)).filter(item => item !== null);

    headingElements.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="max-w-52 pt-7 pl-layout font-caption-14 text-gray-5">
      <p className="mb-3 text-foreground">목차</p>

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
                activeId === item.href && 'text-blue-7 hover:text-blue-7',
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
