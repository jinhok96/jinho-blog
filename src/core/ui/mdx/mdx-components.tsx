import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

export function getMDXComponents() {
  return {
    // 기본 HTML 요소 커스터마이징
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className="mb-4 text-4xl font-bold"
        {...props}
      />
    ),

    h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className="mt-8 mb-3 text-3xl font-semibold"
        {...props}
      />
    ),

    h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className="mt-6 mb-2 text-2xl font-semibold"
        {...props}
      />
    ),

    h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className="mt-4 mb-2 text-xl font-semibold"
        {...props}
      />
    ),

    h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className="mt-4 mb-2 text-lg font-semibold"
        {...props}
      />
    ),

    h6: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className="mt-4 mb-2 text-base font-semibold"
        {...props}
      />
    ),

    p: (props: HTMLAttributes<HTMLParagraphElement>) => (
      <p
        className="mb-4 leading-7"
        {...props}
      />
    ),

    ul: (props: HTMLAttributes<HTMLUListElement>) => (
      <ul
        className="mb-4 ml-6 list-disc space-y-2"
        {...props}
      />
    ),

    ol: (props: HTMLAttributes<HTMLOListElement>) => (
      <ol
        className="mb-4 ml-6 list-decimal space-y-2"
        {...props}
      />
    ),

    li: (props: HTMLAttributes<HTMLLIElement>) => (
      <li
        className="leading-7"
        {...props}
      />
    ),

    blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="mb-4 border-l-4 border-gray-300 pl-4 italic"
        {...props}
      />
    ),

    hr: (props: HTMLAttributes<HTMLHRElement>) => (
      <hr
        className="my-8 border-gray-300"
        {...props}
      />
    ),

    a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={`
          text-blue-600 underline
          hover:text-blue-800
        `}
        {...props}
      />
    ),

    code: (props: HTMLAttributes<HTMLElement>) => (
      <code
        className="rounded-sm bg-gray-100 px-1.5 py-0.5 font-mono text-sm"
        {...props}
      />
    ),

    pre: (props: HTMLAttributes<HTMLPreElement>) => (
      <pre
        className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4"
        {...props}
      />
    ),

    table: (props: TableHTMLAttributes<HTMLTableElement>) => (
      <div className="mb-4 overflow-x-auto">
        <table
          className="min-w-full border-collapse border border-gray-300"
          {...props}
        />
      </div>
    ),

    thead: (props: HTMLAttributes<HTMLTableSectionElement>) => (
      <thead
        className="bg-gray-100"
        {...props}
      />
    ),

    tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,

    tr: (props: HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className="border-b border-gray-300"
        {...props}
      />
    ),

    th: (props: ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={`border border-gray-300 px-4 py-2 text-left font-semibold`}
        {...props}
      />
    ),

    td: (props: TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        className="border border-gray-300 px-4 py-2"
        {...props}
      />
    ),
  };
}
