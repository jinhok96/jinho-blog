import type { Metadata } from 'next';

import { ROUTER } from '@/core/config';
import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentCard } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { getBlogPosts } from '@/entities/blog';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'blog',
  title: 'Blog',
  description: '블로그 목록',
});

export default async function BlogListPage() {
  const posts = await getBlogPosts();

  return (
    <div className="size-full">
      <h1 className="mb-8 text-4xl font-bold">Blog</h1>
      <div className="flex-col-center w-full gap-3">
        {posts.map(({ category, slug, ...post }) => (
          <ContentCard
            key={slug}
            href={`${ROUTER.blog}/${slug}`}
            category={BLOG_CATEGORY_MAP[category]}
            {...post}
          />
        ))}
      </div>
    </div>
  );
}
