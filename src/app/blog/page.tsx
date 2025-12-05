import type { SearchParams } from '@/core/types/internal';
import type { Metadata } from 'next';

import { AsyncBoundary } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { BlogContentSection } from '@/views/blog';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'blog',
  title: '블로그',
  description: '블로그 목록',
});

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function BlogListPage({ searchParams }: Props) {
  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">블로그</h1>

      <div className="flex-row-center w-full justify-between">
        <div>카테고리</div>
        <div>필터</div>
      </div>

      <AsyncBoundary>
        <BlogContentSection searchParams={searchParams} />
      </AsyncBoundary>
    </div>
  );
}
