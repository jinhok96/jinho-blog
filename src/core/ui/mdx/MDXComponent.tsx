import type { Options as RehypeAutolinkHeadingsOptions } from 'rehype-autolink-headings';

import { MDXRemote } from 'next-mdx-remote-client/rsc';

import matter from 'gray-matter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { createMDXComponents } from '@/core/ui/mdx/createMDXComponents';

type Props = {
  fileContent: string;
  modalView?: boolean;
};

export function MDXComponent({ fileContent, modalView }: Props) {
  const { content } = matter(fileContent);
  const components = createMDXComponents(modalView);

  return (
    <article className="flex-col-start size-full gap-2">
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                { behavior: 'append', properties: { className: 'hidden' } } satisfies RehypeAutolinkHeadingsOptions,
              ],
            ],
          },
        }}
      />
    </article>
  );
}
