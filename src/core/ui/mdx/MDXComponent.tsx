import type { Options as RehypeAutolinkHeadingsOptions } from 'rehype-autolink-headings';

import { MDXRemote } from 'next-mdx-remote-client/rsc';

import matter from 'gray-matter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { createMDXComponents } from '@/core/ui/mdx/createMDXComponents';

type Props = {
  fileContent: string;
};

export function MDXComponent({ fileContent }: Props) {
  return (
    <MDXRemote
      source={matter(fileContent).content}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'append' } satisfies RehypeAutolinkHeadingsOptions],
          ],
        },
      }}
      components={createMDXComponents()}
    />
  );
}
