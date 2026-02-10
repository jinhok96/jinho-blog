import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';

import { AsyncBoundary, ContentDetailWrapper } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { createBlogService, type GetBlogPosts } from '@/entities/blog';

import { BlogPostContentSection, OtherBlogContentSection } from '@/views/blogPost';

const blogService = createBlogService();

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams<Record<keyof GetBlogPosts['search'], string | string[] | undefined>>>;
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
    type: 'article',
  });
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);

  const [post, fileContent] = await Promise.all([
    blogService.getBlogPost({ slug }),
    blogService.getBlogContent({ slug }),
  ]);

  if (!post) notFound();
  if (!fileContent) notFound();

  const { category } = post;

  return (
    <>
      <ContentDetailWrapper rootHref={routes({ pathname: '/blog' })}>
        <BlogPostContentSection
          post={post}
          fileContent={fileContent}
        />

        <AsyncBoundary>
          <OtherBlogContentSection
            category={category}
            page={page}
          />
        </AsyncBoundary>
      </ContentDetailWrapper>
    </>
  );
}
