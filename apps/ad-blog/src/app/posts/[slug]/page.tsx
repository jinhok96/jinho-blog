import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { CATEGORY_MAP } from '@/core/config';
import { renderMdx } from '@/core/mdx';
import { categoryPath, HOME_BREADCRUMB } from '@/core/routes';
import { blogPostingJsonLd, breadcrumbJsonLd, buildMetadata, JsonLd, selectOgImage } from '@/core/seo';
import { withEmptyStaticParam } from '@/core/utils';

import { getAdjacentPosts, getPost, getPosts, getRelatedPosts } from '@/entities/post';

import { PostView } from '@/views/post';

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return withEmptyStaticParam(
    getPosts().map(post => ({ slug: post.slug })),
    ['slug'],
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};

  return buildMetadata({
    path: post.path,
    title: post.title,
    description: post.description,
    type: 'article',
    image: selectOgImage(post),
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
    keywords: post.tags,
    // 초안(개발 서버 전용)은 색인 제외
    noindex: post.draft,
  });
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const { content, toc } = await renderMdx(post.content, post.path);
  const categoryName = CATEGORY_MAP[post.category].name;
  const breadcrumbs = [
    HOME_BREADCRUMB,
    { name: categoryName, path: categoryPath(post.category) },
    { name: post.title, path: post.path },
  ];

  return (
    <>
      <JsonLd
        jsonLd={blogPostingJsonLd({
          title: post.title,
          description: post.description,
          path: post.path,
          image: post.ogImage ?? post.thumbnail,
          publishedTime: post.createdAt,
          modifiedTime: post.updatedAt,
          section: categoryName,
          keywords: post.tags,
        })}
      />
      <JsonLd jsonLd={breadcrumbJsonLd(breadcrumbs)} />
      <PostView
        post={post}
        content={content}
        toc={toc}
        relatedPosts={getRelatedPosts(post)}
        adjacentPosts={getAdjacentPosts(post)}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
