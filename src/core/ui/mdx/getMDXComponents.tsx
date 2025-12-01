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

export function getMDXComponents() {
  return {
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className="mb-4 font-title-40"
        {...props}
      />
    ),

    h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className="mt-10 mb-5 font-subtitle-32"
        {...props}
      />
    ),

    h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className="mt-8 mb-4 font-subtitle-28"
        {...props}
      />
    ),

    h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className="mt-6 mb-3 font-subtitle-24"
        {...props}
      />
    ),

    h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className="my-3 font-subtitle-20"
        {...props}
      />
    ),

    h6: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className="my-3 font-subtitle-16"
        {...props}
      />
    ),

    p: (props: HTMLAttributes<HTMLParagraphElement>) => (
      <div
        className="group mb-4 font-body-16"
        {...props}
      />
    ),

    a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={`
          mx-1 text-gray-7 underline underline-offset-2 animated-100
          hover:text-gray-9
        `}
        {...props}
      />
    ),

    ul: (props: HTMLAttributes<HTMLUListElement>) => (
      <ul
        className={`
          mb-4 ml-7 list-disc space-y-2
          in-[li]:mt-2 in-[li]:ml-5
        `}
        {...props}
      />
    ),

    ol: (props: HTMLAttributes<HTMLOListElement>) => (
      <ol
        className="mb-4 ml-7 list-decimal space-y-2"
        {...props}
      />
    ),

    li: (props: HTMLAttributes<HTMLLIElement>) => <li {...props} />,

    blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="mb-4 ml-0.5 border-l-4 border-gray-4 pl-3 font-caption-16 italic"
        {...props}
      />
    ),

    hr: (props: HTMLAttributes<HTMLHRElement>) => (
      <hr
        className="my-8 border-gray-3"
        {...props}
      />
    ),

    code: (props: ComponentProps<typeof Code>) => (
      <Code
        className="group-has-[pre]:mx-1! group-has-[pre]:bg-gray-1! group-has-[pre]:px-1.5! group-has-[pre]:py-0.5!"
        {...props}
      />
    ),

    pre: (props: HTMLAttributes<HTMLPreElement>) => (
      <Callout
        className={`mb-4 overflow-x-auto rounded-xl bg-gray-1 p-4`}
        {...props}
      />
    ),

    table: (props: TableHTMLAttributes<HTMLTableElement>) => (
      <div className="mb-4 border-collapse overflow-auto rounded-xl border border-gray-3">
        <table
          className="size-full"
          {...props}
        />
      </div>
    ),

    thead: (props: HTMLAttributes<HTMLTableSectionElement>) => (
      <thead
        className="bg-gray-1"
        {...props}
      />
    ),

    tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,

    tr: (props: HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={`
          border-b border-gray-3
          last:border-0
        `}
        {...props}
      />
    ),

    th: (props: ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={`
          border-r border-gray-3 px-4 py-3 text-left font-semibold
          last:border-0
        `}
        {...props}
      />
    ),

    td: (props: TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        className={`
          border-r border-gray-3 px-4 py-3
          last:border-0
        `}
        {...props}
      />
    ),
  };
}
