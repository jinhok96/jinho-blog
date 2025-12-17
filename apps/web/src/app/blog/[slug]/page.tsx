import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentDetailWrapper, ContentHeader, MDXComponent } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { createBlogService } from '@/entities/blog';

const blogService = createBlogService();

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogService.getBlogPost({ slug });

  if (!post) return {};

  return generatePageMetadata({
    path: routes({ pathname: '/blog/[slug]', params: { slug } }),
    title: post.title,
    description: post.description,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await blogService.getBlogPost({ slug });

  if (!post) notFound();

  const { title, category, createdAt, updatedAt } = post;

  const fileContent = await blogService.getBlogContent({ slug });

  if (!fileContent) notFound();

  return (
    <ContentDetailWrapper rootHref={routes({ pathname: '/blog' })}>
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
