import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { MDXComponent } from '@/core/ui';
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
      <div className="mb-5">
        <p className="mb-2 font-caption-20 text-gray-6">{category}</p>
        <h1 className="mb-4 font-title-40">{title}</h1>
        <p className="font-subtitle-16 text-gray-6">{description}</p>
      </div>

      <div className="mb-8 flex-col-start w-full gap-4">
        <div className="flex-row-center w-full gap-3">
          <time className="font-caption-14 text-gray-6">작성일: {formatDateToString(createdAt)}</time>
          <time className="font-caption-14 text-gray-6">수정일: {formatDateToString(updatedAt)}</time>
        </div>
      </div>

      <MDXComponent filePath={filePath} />
    </article>
  );
}
