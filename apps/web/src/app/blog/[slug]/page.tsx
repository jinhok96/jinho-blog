import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentDetailWrapper, ContentHeader, MDXComponent, Show } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { createBlogService, type GetBlogPosts } from '@/entities/blog';

import { Pagination } from '@/features/pagination';

import { BlogContentSection } from '@/views/blog';

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
  });
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const post = await blogService.getBlogPost({ slug });

  if (!post) notFound();

  const { title, category, createdAt, updatedAt } = post;

  const fileContent = await blogService.getBlogContent({ slug });

  if (!fileContent) notFound();

  const { page } = await searchParams;
  const { items, pagination } = await blogService.getBlogPosts({ category, page: page?.toString(), count: '6' });

  return (
    <>
      <ContentDetailWrapper rootHref={routes({ pathname: '/blog' })}>
        <ContentHeader
          category={BLOG_CATEGORY_MAP[category]}
          title={title}
          createdAt={createdAt}
          updatedAt={updatedAt}
        />

        <MDXComponent fileContent={fileContent} />

        <Show when={items.length}>
          <section className="w-full pt-20">
            <p className="pb-7 font-subtitle-22">
              <span className="font-bold text-blue-7">{BLOG_CATEGORY_MAP[category]}</span> 카테고리 다른 글
            </p>

            <BlogContentSection posts={items} />

            <Pagination
              pagination={pagination}
              scroll={false}
            />
          </section>
        </Show>
      </ContentDetailWrapper>
    </>
  );
}
