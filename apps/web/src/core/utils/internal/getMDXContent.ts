import type { JSX } from 'react';

import { evaluate } from 'next-mdx-remote-client/rsc';

import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import remarkFlexibleToc, { type TocItem } from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';

import { createMDXComponents } from '@/core/ui';

type Scope = {
  toc?: TocItem[];
};

type Options = {
  modalView?: boolean;
};

type GetMDXContent = {
  content: JSX.Element;
  toc: TocItem[] | undefined;
};

export async function getMDXContent(fileContent: string, { modalView }: Options): Promise<GetMDXContent> {
  const { content: source } = matter(fileContent);
  const components = createMDXComponents(modalView);

  const { content, scope } = await evaluate<Record<string, unknown>, Scope>({
    source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkFlexibleToc],
        rehypePlugins: [rehypeSlug],
      },
      vfileDataIntoScope: 'toc',
    },
  });

  return { content, toc: scope.toc };
}
