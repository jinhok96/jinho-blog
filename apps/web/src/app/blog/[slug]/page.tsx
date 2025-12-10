import type { Blog } from '@jinho-blog/mdx-handler';
import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ROUTER } from '@/core/config';
import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentDetailWrapper, ContentHeader, MDXComponent } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

async function fetchBlogPost(slug: string): Promise<Blog | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  return res.json();
}

async function fetchBlogContent(slug: string): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog/${slug}/content`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const { content } = await res.json();
  return content;
}

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post) return {};

  return generatePageMetadata({
    routerName: 'blog',
    title: post.title,
    description: post.description,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post) notFound();

  const { title, category, createdAt, updatedAt } = post;

  const fileContent = await fetchBlogContent(slug);

  if (!fileContent) notFound();

  return (
    <ContentDetailWrapper rootHref={ROUTER.blog}>
      <ContentHeader
        category={BLOG_CATEGORY_MAP[category]}
        title={title}
        createdAt={createdAt}
        updatedAt={updatedAt}
      />

      <MDXComponent fileContent={fileContent} />
    </ContentDetailWrapper>
  );
}
