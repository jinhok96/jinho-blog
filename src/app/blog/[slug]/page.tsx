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
import { formatDateToString, generatePageMetadata } from '@/core/utils';

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

  const { title, description, category, createdAt, updatedAt, filePath } = post;

  return (
    <article className="container mx-auto max-w-4xl p-layout">
      <h1 className="mb-4 font-title-40">{title}</h1>
      <p className="font-subtitle-16 text-gray-6">{description}</p>

      <div className="mb-8 flex-col-start w-full gap-4">
        <div className="flex-row-center w-full gap-3">
          <time className="font-caption-14 text-gray-6">작성일: {formatDateToString(createdAt)}</time>
          <time className="font-caption-14 text-gray-6">수정일: {formatDateToString(updatedAt)}</time>
        </div>

        <span className="rounded-md bg-foreground px-2 py-1 font-caption-14 text-background">{category}</span>
      </div>

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
        components={getMDXComponents()}
      />
    </article>
  );
}
