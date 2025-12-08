import type { BlogCategory, SearchParams } from '@/core/types';
import type { Metadata } from 'next';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { AsyncBoundary } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { SelectCategory } from '@/features/selectCategory';
import { SelectSort } from '@/features/selectSort';

import { BlogContentSection } from '@/views/blog';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'blog',
  title: '블로그',
  description: '블로그 목록',
});

const CATEGORY_OPTIONS: Array<{ key: BlogCategory; label: string }> = [
  { key: 'frontend', label: BLOG_CATEGORY_MAP.frontend },
  { key: 'algorithm', label: BLOG_CATEGORY_MAP.algorithm },
  { key: 'cs', label: BLOG_CATEGORY_MAP.cs },
  { key: 'uiux', label: BLOG_CATEGORY_MAP.uiux },
  { key: 'review', label: BLOG_CATEGORY_MAP.review },
];

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function BlogListPage({ searchParams }: Props) {
  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">블로그</h1>

      <div className="z-10 flex-row-center w-full justify-between">
        <AsyncBoundary>
          <SelectCategory options={CATEGORY_OPTIONS} />
        </AsyncBoundary>
        <SelectSort />
      </div>

      <AsyncBoundary>
        <BlogContentSection searchParams={searchParams} />
      </AsyncBoundary>
    </div>
  );
}
