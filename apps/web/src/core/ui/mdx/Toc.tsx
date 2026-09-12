'use client';

import type { TocItem } from 'remark-flexible-toc';

import { type ComponentProps, type MouseEventHandler, useEffect as useLayoutEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { LinkButton } from '@/core/ui/button';
import { cn } from '@/core/utils';

import ArrowUpIcon from 'public/icons/arrow_circle_up.svg';
import LinkIcon from 'public/icons/link.svg';

const depthClassNameMap: Record<TocItem['depth'], string> = {
  1: 'pl-0',
  2: 'pl-2',
  3: 'pl-4',
  4: 'pl-6',
  5: 'pl-8',
  6: 'pl-10',
};

type TocLinkButtonProps = ComponentProps<typeof LinkButton> & {
  activeId?: string;
  depth?: TocItem['depth'];
};

function TocLinkButton({ children, href, activeId, depth, className, onClick, ...props }: TocLinkButtonProps) {
  const handleScrollToTop: MouseEventHandler<HTMLAnchorElement> = e => {
    if (typeof window === 'undefined') return;
    if (href !== '#') return;

    window.scrollTo(0, 0);
    onClick?.(e);
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
        className,
      )}
      onClick={handleScrollToTop}
      {...props}
    >
      {children}
    </LinkButton>
  );
}

type TocProps = {
  toc?: TocItem[];
  className?: string;
};

export function Toc({ toc, className }: TocProps) {
  const [activeId, setActiveId] = useState('');
  const pathname = usePathname();

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

    const headingElements = toc.map(item => document.getElementById(item.href.slice(1))).filter(item => item !== null);

    headingElements.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [toc]);

  return (
    <nav
      aria-label="목차"
      className={cn('font-caption-14 text-gray-5', className)}
    >
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

        {/* 구분선: 장식 목적이므로 보조 기술에는 노출하지 않는다 */}
        <li
          aria-hidden="true"
          className="mt-2 mb-3 h-0 w-full border-t border-gray-2"
        />

        <li>
          <TocLinkButton
            className="flex-row-center gap-2"
            href={`https://github.com/jinhok96/jinho-blog/edit/mdx/content/mdx${pathname}.mdx`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>이 문서 편집하기</span>
            <div className="size-3.5">
              <LinkIcon strokeWidth={1.5} />
            </div>
          </TocLinkButton>
        </li>

        <li>
          <TocLinkButton
            className="flex-row-center gap-2"
            href="#"
          >
            <span>맨 위로</span>
            <div className="size-4">
              <ArrowUpIcon strokeWidth={1.5} />
            </div>
          </TocLinkButton>
        </li>
      </ul>
    </nav>
  );
}
