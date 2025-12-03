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
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-40">블로그</h1>

      <div className="flex-row-center w-full justify-between">
        <div>카테고리(전체, ... / 좌우 스크롤, 스크롤 양 옆 페이드아웃)</div>
        <div>필터</div>
      </div>

      <div
        className={`
          flex-col-center size-full grid-cols-2 gap-4
          tablet:grid
          desktop:grid-cols-3
        `}
      >
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
