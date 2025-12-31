'use client';

import type { TocItem } from 'remark-flexible-toc';

import { type PropsWithChildren, useEffect as useLayoutEffect, useState } from 'react';

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

type TocLinkButtonProps = PropsWithChildren<{
  href: string;
  activeId?: string;
  depth?: TocItem['depth'];
}>;

function TocLinkButton({ children, href, activeId, depth }: TocLinkButtonProps) {
  const handleScrollToTop = () => {
    if (typeof window === 'undefined') return;
    if (href !== '#') return;

    window.scrollTo(0, 0);
  };

  return (
    <LinkButton
      href={href}
      className={cn(
        `
          py-1 transition-colors
          hover:text-gray-8
        `,
        depth && depthClassNameMap[depth],
        activeId === href && 'text-blue-7 hover:text-blue-7',
      )}
      onClick={handleScrollToTop}
    >
      {children}
    </LinkButton>
  );
}

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
            <TocLinkButton
              activeId={activeId}
              href={item.href}
              depth={item.depth}
            >
              {item.value}
            </TocLinkButton>
          </li>
        ))}

        <hr className="mt-2 mb-3 w-full border-gray-2" />

        <li>
          <TocLinkButton
            activeId=""
            href="#"
          >
            이 문서 편집하기
          </TocLinkButton>
        </li>

        <li>
          <TocLinkButton href="#">맨 위로</TocLinkButton>
        </li>
      </ul>
    </div>
  );
}
