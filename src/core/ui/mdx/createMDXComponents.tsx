import type {
  AnchorHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

import Callout from '@/core/ui/mdx/Callout';
import Code from '@/core/ui/mdx/Code';
import { cn } from '@/core/utils';

import LinkIcon from 'public/icons/link.svg';

export function createMDXComponents(modalView?: boolean) {
  return {
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className={cn('pb-3 font-title-40', modalView && 'font-title-32')}
        {...props}
      />
    ),

    h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn('pt-7 pb-3 font-subtitle-32', modalView && 'font-subtitle-26')}
        {...props}
      />
    ),

    h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className={cn('pt-6 pb-3 font-subtitle-26', modalView && 'font-subtitle-22')}
        {...props}
      />
    ),

    h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className={cn('pt-5 pb-2 font-subtitle-20', modalView && 'font-subtitle-18')}
        {...props}
      />
    ),

    h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className="pt-3 pb-2 font-subtitle-16"
        {...props}
      />
    ),

    h6: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className="pt-3 pb-2 font-subtitle-14"
        {...props}
      />
    ),

    p: (props: HTMLAttributes<HTMLParagraphElement>) => (
      <div
        className="group font-body-16"
        {...props}
      />
    ),

    a: ({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={`
          mx-1 underline underline-offset-2 animated-100
          first:ml-0
          hover:text-blue-7
        `}
        target="_blank"
        {...props}
      >
        <span className="peer">{children}</span>
        <span
          className={`
            h-full pl-1 text-gray-5 animated-100
            peer-hover:text-blue-7
            hover:text-blue-7
          `}
        >
          <div className="flex-row-center inline-block size-4 h-full pb-0.5 align-middle">
            <LinkIcon strokeWidth={1.5} />
          </div>
        </span>
      </a>
    ),

    ul: (props: HTMLAttributes<HTMLUListElement>) => (
      <ul
        className={`
          ml-7 list-disc space-y-1
          in-[li]:ml-5 in-[li]:pt-2
        `}
        {...props}
      />
    ),

    ol: (props: HTMLAttributes<HTMLOListElement>) => (
      <ol
        className="ml-7 list-decimal space-y-2"
        {...props}
      />
    ),

    li: (props: HTMLAttributes<HTMLLIElement>) => <li {...props} />,

    blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="ml-0.5 border-l-4 border-gray-4 pl-3 font-caption-16 italic"
        {...props}
      />
    ),

    hr: (props: HTMLAttributes<HTMLHRElement>) => (
      <hr
        className="mt-4 w-full border-gray-2"
        {...props}
      />
    ),

    code: ({ className, ...props }: ComponentProps<typeof Code>) => {
      const language = className?.replace('language-', '');

      return (
        <Code
          className="group-has-[pre]:mx-1! group-has-[pre]:bg-gray-1! group-has-[pre]:px-1.5! group-has-[pre]:py-0.5!"
          language={language}
          {...props}
        />
      );
    },

    pre: (props: HTMLAttributes<HTMLPreElement>) => <Callout {...props} />,

    table: (props: TableHTMLAttributes<HTMLTableElement>) => (
      <div className="border-collapse overflow-auto rounded-xl border border-gray-2">
        <table
          className="size-full"
          {...props}
        />
      </div>
    ),

    thead: (props: HTMLAttributes<HTMLTableSectionElement>) => (
      <thead
        className="border-b border-gray-2 bg-gray-1"
        {...props}
      />
    ),

    tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,

    tr: (props: HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={`
          border-b border-gray-2
          last:border-0
        `}
        {...props}
      />
    ),

    th: (props: ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={`
          border-r border-gray-2 px-3 py-2 text-left font-semibold
          last:border-0
        `}
        {...props}
      />
    ),

    td: (props: TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        className={`
          border-r border-gray-2 px-3 py-2
          last:border-0
        `}
        {...props}
      />
    ),

    Callout: (props: HTMLAttributes<HTMLDivElement>) => <Callout {...props} />,
  };
}
