import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';

import { AsyncBoundary, ContentDetailWrapper, JsonLd } from '@/core/ui';
import { generateBlogPostingJsonLd, generatePageMetadata } from '@/core/utils';

import { createTranslateService, type GetTranslatePosts } from '@/entities/translate';

import { OtherTranslateContentSection, TranslatePostContentSection } from '@/views/translatePost';

const translateService = createTranslateService();

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams<Record<keyof GetTranslatePosts['search'], string | string[] | undefined>>>;
};

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
  });
}

export default async function TranslatePostPage({ params, searchParams }: Props) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);

  const [post, fileContent] = await Promise.all([
    translateService.getTranslatePost({ slug }),
    translateService.getTranslateContent({ slug }),
  ]);

  if (!post) notFound();
  if (!fileContent) notFound();

  const { category } = post;
  const jsonLd = generateBlogPostingJsonLd(post);

  return (
    <>
      <JsonLd jsonLd={jsonLd} />

      <ContentDetailWrapper rootHref={routes({ pathname: '/translate' })}>
        <TranslatePostContentSection
          post={post}
          fileContent={fileContent}
        />

        <AsyncBoundary>
          <OtherTranslateContentSection
            category={category}
            page={page}
          />
        </AsyncBoundary>
      </ContentDetailWrapper>
    </>
  );
}
