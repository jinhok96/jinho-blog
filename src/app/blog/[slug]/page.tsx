import type { Metadata } from 'next';
import type { Options as RehypeAutolinkHeadingsOptions } from 'rehype-autolink-headings';

import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { notFound } from 'next/navigation';

import * as fs from 'fs';
import matter from 'gray-matter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { getMDXComponents } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { getBlogPost, getBlogPosts } from '@/entities/blog';

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG: 빌드 시 모든 경로 생성
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) return {};

  return generatePageMetadata({
    routerName: 'blog',
    title: post.title,
    description: post.description,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
      <div className="mb-8 flex items-center gap-4">
        <time className="text-gray-600">{new Date(post.createdAt).toLocaleDateString('ko-KR')}</time>

        <div className="flex flex-wrap gap-2">
          {post.category.map(cat => (
            <span
              key={cat}
              className="rounded-sm bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div>
        {post.filePath && (
          <MDXRemote
            source={matter(fs.readFileSync(post.filePath, 'utf-8')).content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'append' } satisfies RehypeAutolinkHeadingsOptions],
                ],
              },
            }}
            components={getMDXComponents()}
          />
        )}
      </div>
    </article>
  );
}
