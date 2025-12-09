import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { readFileSync } from 'fs';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentHeader, MDXComponent } from '@/core/ui';
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

  const { title, category, createdAt, updatedAt, filePath } = post;

  const fileContent = readFileSync(filePath, 'utf-8');

  return (
    <div className="size-full">
      <ContentHeader
        category={BLOG_CATEGORY_MAP[category]}
        title={title}
        createdAt={createdAt}
        updatedAt={updatedAt}
      />

      <MDXComponent fileContent={fileContent} />
    </div>
  );
}
