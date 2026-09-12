import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';
import { BLOG_CATEGORY_MAP } from '@jinho-blog/shared';

import { AsyncBoundary, ContentDetailWrapper, JsonLd } from '@/core/ui';
import { generateBlogPostingJsonLd, generateBreadcrumbJsonLd, generatePageMetadata } from '@/core/utils';

import { createBlogService } from '@/entities/blog';

import { BlogPostContentSection, OtherBlogContentSection } from '@/views/blogPost';

const blogService = createBlogService();

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO: 전체 포스트를 빌드 시점에 정적 생성 (크롤러 응답 속도/색인 효율 개선)
export async function generateStaticParams() {
  const { items } = await blogService.getBlogPosts({ count: '1000' });
  return items.map(({ slug }) => ({ slug }));
}

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
    thumbnail: post.thumbnail,
    keywords: [BLOG_CATEGORY_MAP[post.category]],
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const [post, fileContent] = await Promise.all([
    blogService.getBlogPost({ slug }),
    blogService.getBlogContent({ slug }),
  ]);

  if (!post) notFound();
  if (!fileContent) notFound();

  const { category } = post;

  const { items: otherPosts } = await blogService.getBlogPosts({ category, count: '1000' });

  const jsonLd = generateBlogPostingJsonLd(post);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: routes({ pathname: '/' }) },
    { name: '블로그', path: routes({ pathname: '/blog' }) },
    { name: post.title, path: post.path },
  ]);

  return (
    <>
      {/* JSON-LD: BlogPosting */}
      <JsonLd jsonLd={jsonLd} />
      {/* JSON-LD: BreadcrumbList */}
      <JsonLd jsonLd={breadcrumbJsonLd} />

      <ContentDetailWrapper rootHref={routes({ pathname: '/blog' })}>
        <BlogPostContentSection
          post={post}
          fileContent={fileContent}
        />

        <AsyncBoundary>
          <OtherBlogContentSection
            category={category}
            posts={otherPosts}
          />
        </AsyncBoundary>
      </ContentDetailWrapper>
    </>
  );
}
