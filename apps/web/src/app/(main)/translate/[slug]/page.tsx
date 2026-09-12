import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';
import { TRANSLATE_CATEGORY_MAP } from '@jinho-blog/shared';

import { AsyncBoundary, ContentDetailWrapper, JsonLd } from '@/core/ui';
import { generateBlogPostingJsonLd, generateBreadcrumbJsonLd, generatePageMetadata } from '@/core/utils';

import { createTranslateService } from '@/entities/translate';

import { OtherTranslateContentSection, TranslatePostContentSection } from '@/views/translatePost';

const translateService = createTranslateService();

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO: 전체 포스트를 빌드 시점에 정적 생성 (크롤러 응답 속도/색인 효율 개선)
export async function generateStaticParams() {
  const { items } = await translateService.getTranslatePosts({ count: '1000' });
  return items.map(({ slug }) => ({ slug }));
}

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await translateService.getTranslatePost({ slug });

  if (!post) return {};

  return generatePageMetadata({
    path: routes({ pathname: '/translate/[slug]', params: { slug } }),
    title: post.title,
    description: post.description,
    type: 'article',
    thumbnail: post.thumbnail,
    keywords: ['번역', TRANSLATE_CATEGORY_MAP[post.category]],
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function TranslatePostPage({ params }: Props) {
  const { slug } = await params;

  const [post, fileContent] = await Promise.all([
    translateService.getTranslatePost({ slug }),
    translateService.getTranslateContent({ slug }),
  ]);

  if (!post) notFound();
  if (!fileContent) notFound();

  const { category } = post;

  const { items: otherPosts } = await translateService.getTranslatePosts({ category, count: '1000' });

  const jsonLd = generateBlogPostingJsonLd(post);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: routes({ pathname: '/' }) },
    { name: '번역', path: routes({ pathname: '/translate' }) },
    { name: post.title, path: post.path },
  ]);

  return (
    <>
      {/* JSON-LD: BlogPosting */}
      <JsonLd jsonLd={jsonLd} />
      {/* JSON-LD: BreadcrumbList */}
      <JsonLd jsonLd={breadcrumbJsonLd} />

      <ContentDetailWrapper rootHref={routes({ pathname: '/translate' })}>
        <TranslatePostContentSection
          post={post}
          fileContent={fileContent}
        />

        <AsyncBoundary>
          <OtherTranslateContentSection
            category={category}
            posts={otherPosts}
          />
        </AsyncBoundary>
      </ContentDetailWrapper>
    </>
  );
}
