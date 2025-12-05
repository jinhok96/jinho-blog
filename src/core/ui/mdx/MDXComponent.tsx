import type { Options as RehypeAutolinkHeadingsOptions } from 'rehype-autolink-headings';

import { MDXRemote } from 'next-mdx-remote-client/rsc';

import * as fs from 'fs';
import matter from 'gray-matter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { createMDXComponents } from '@/core/ui/mdx/createMDXComponents';

type Props = {
  filePath: string;
};

export function MDXComponent({ filePath }: Props) {
  return (
    <MDXRemote
      source={matter(fs.readFileSync(filePath, 'utf-8')).content}
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
