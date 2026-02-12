import type { ComponentProps, HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import Image from 'next/image';

import { LinkButton } from '@/core/ui/button';
import Callout from '@/core/ui/mdx/Callout';
import Code from '@/core/ui/mdx/Code';
import { cn } from '@/core/utils';

import LinkIcon from 'public/icons/link.svg';

export function createMDXComponents(isModalView?: boolean) {
  return {
    h1: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className={cn('scroll-mt-(--height-header) pb-1 font-title-40', isModalView && 'font-title-32', className)}
        {...props}
      />
    ),

    h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn(
          'scroll-mt-(--height-header) pb-1 font-subtitle-32',
          isModalView && 'font-subtitle-26',
          className,
        )}
        {...props}
      />
    ),

    h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className={cn('scroll-mt-(--height-header) font-subtitle-26', isModalView && 'font-subtitle-22', className)}
        {...props}
      />
    ),

    h4: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className={cn('scroll-mt-(--height-header) font-subtitle-20', isModalView && 'font-subtitle-18', className)}
        {...props}
      />
    ),

    h5: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className={cn('scroll-mt-(--height-header) font-subtitle-16', className)}
        {...props}
      />
    ),

    h6: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className={cn('scroll-mt-(--height-header) font-subtitle-14', className)}
        {...props}
      />
    ),

    p: ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
      <div
        className={cn('font-body-16', className)}
        {...props}
      />
    ),

    a: ({ children, className, href, ...props }: ComponentProps<typeof LinkButton>) => (
      <LinkButton
        className={cn(
          `
            group/a mr-1.5! p-0! underline underline-offset-2 animated-100
            hover:text-blue-7
          `,
          className,
        )}
        target="_blank"
        href={href || '#'}
        {...props}
      >
        <span>{children}</span>
        <span
          className={`
            h-full pl-1 text-gray-5 animated-100
            group-hover/a:text-inherit
          `}
        >
          <div className="flex-row-center inline-block size-4 h-full pb-0.5 align-middle">
            <LinkIcon strokeWidth={1.5} />
          </div>
        </span>
      </LinkButton>
    ),

    ul: ({ className, ...props }: HTMLAttributes<HTMLUListElement>) => (
      <ul
        className={cn(
          `
            ml-7 list-disc space-y-1
            in-[li]:ml-5 in-[li]:pt-2
          `,
          className,
        )}
        {...props}
      />
    ),

    ol: ({ className, ...props }: HTMLAttributes<HTMLOListElement>) => (
      <ol
        className={cn('ml-7 list-decimal space-y-2', className)}
        {...props}
      />
    ),

    li: (props: HTMLAttributes<HTMLLIElement>) => <li {...props} />,

    blockquote: ({ className, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className={cn('ml-0.5 border-l-4 border-gray-4 pl-3 font-caption-16 italic', className)}
        {...props}
      />
    ),

    hr: ({ className, ...props }: HTMLAttributes<HTMLHRElement>) => (
      <hr
        className={cn('mt-4 w-full border-gray-3', className)}
        {...props}
      />
    ),

    code: ({ className, ...props }: ComponentProps<typeof Code>) => {
      const language = className?.replace('language-', '');

      return (
        <Code
          className={`
            not-group-has-[pre]/code:mx-0! not-group-has-[pre]/code:bg-foreground-2! not-group-has-[pre]/code:px-1.5!
            not-group-has-[pre]/code:py-0.5!
          `}
          language={language}
          {...props}
        />
      );
    },

    pre: ({ className, ...props }: HTMLAttributes<HTMLPreElement>) => (
      <Callout
        copyable
        className={cn('group/code', className)}
        {...props}
      />
    ),

    table: ({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) => (
      <div className={cn('border-collapse overflow-auto rounded-xl border border-gray-3', className)}>
        <table
          className="size-full"
          {...props}
        />
      </div>
    ),

    thead: ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
      <thead
        className={cn('border-b border-gray-3 bg-gray-1', className)}
        {...props}
      />
    ),

    tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,

    tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={cn(
          `
            border-b border-gray-3
            last:border-0
          `,
          className,
        )}
        {...props}
      />
    ),

    th: ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={cn(
          `
            border-r border-gray-3 px-3 py-2 text-left font-semibold
            last:border-0
          `,
          className,
        )}
        {...props}
      />
    ),

    td: ({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        className={cn(
          `
            border-r border-gray-3 px-3 py-2
            last:border-0
          `,
          className,
        )}
        {...props}
      />
    ),

    Callout: (props: HTMLAttributes<HTMLDivElement>) => <Callout {...props} />,

    img: ({ src, alt, ...props }: HTMLAttributes<HTMLImageElement> & { src: string; alt: string }) => (
      <Image
        {...props}
        className="overflow-hidden rounded-2xl"
        src={src}
        alt={alt}
        width="800"
        height="800"
      />
    ),
  };
}
