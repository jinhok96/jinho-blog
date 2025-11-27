import type { PropsWithChildren } from 'react';

import Callout from '@/core/ui/markdown/Callout';
import Code from '@/core/ui/markdown/Code';
import CodeBlock from '@/core/ui/markdown/CodeBlock';

type MarkdownProps = PropsWithChildren;

export function Markdown({ children }: MarkdownProps) {
  return <article className="flex-col-start size-full gap-2 font-body-16">{children}</article>;
}

type HProps = PropsWithChildren;

function H1({ children }: HProps) {
  return <h1 className="font-title-36">{children}</h1>;
}

function H2({ children }: HProps) {
  return <h2 className="font-subtitle-28">{children}</h2>;
}

function H3({ children }: HProps) {
  return <h3 className="font-subtitle-24">{children}</h3>;
}

function H4({ children }: HProps) {
  return <h4 className="font-subtitle-20">{children}</h4>;
}

function H5({ children }: HProps) {
  return <h5 className="font-subtitle-18">{children}</h5>;
}

function Parser() {
  return <div className="mt-4 mb-6 h-px w-full bg-gray-2" />;
}

function Link() {}

Markdown.Code = Code;
Markdown.CodeBlock = CodeBlock;
Markdown.Callout = Callout;

Markdown.H1 = H1;
Markdown.H2 = H2;
Markdown.H3 = H3;
Markdown.H4 = H4;
Markdown.H5 = H5;

Markdown.Parser = Parser;
Markdown.Link = Link;
