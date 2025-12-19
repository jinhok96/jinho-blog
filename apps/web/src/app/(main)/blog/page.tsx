import type { BlogCategory } from '@jinho-blog/shared';
import type { Metadata } from 'next';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { type SelectOption } from '@/core/ui';
import { generatePageMetadata, parseSearchParams } from '@/core/utils';

import { createBlogService, type GetBlogPosts } from '@/entities/blog';

import { Pagination } from '@/features/pagination';
import { SelectCategory } from '@/features/selectCategory';
import { SelectSort } from '@/features/selectSort';

import { BlogContentSection } from '@/views/blog';

const blogService = createBlogService();

export const metadata: Metadata = generatePageMetadata({
  path: routes({ pathname: '/blog' }),
  title: '블로그',
  description: '블로그 목록',
});

const CATEGORY_OPTIONS: SelectOption<BlogCategory>[] = [
  { key: 'frontend', label: BLOG_CATEGORY_MAP.frontend },
  { key: 'algorithm', label: BLOG_CATEGORY_MAP.algorithm },
  { key: 'cs', label: BLOG_CATEGORY_MAP.cs },
  { key: 'uiux', label: BLOG_CATEGORY_MAP.uiux },
  { key: 'review', label: BLOG_CATEGORY_MAP.review },
];

type Props = {
  searchParams: Promise<SearchParams<Record<keyof GetBlogPosts['search'], string | string[] | undefined>>>;
};

export default async function BlogListPage({ searchParams }: Props) {
  const { category, sort, page, count, search } = await searchParams;

  const getBlogPostsParams: GetBlogPosts['search'] = {
    category: parseSearchParams.category(category),
    sort: parseSearchParams.sort(sort),
    page: parseSearchParams.page(page)?.toString(),
    count: parseSearchParams.count(count)?.toString(),
    search: parseSearchParams.search(search)?.join(','),
  };

  const { items, pagination } = await blogService.getBlogPosts(getBlogPostsParams);

  return (
    <div className="flex-col-start size-full flex-1 gap-6">
      <h1 className="font-title-36">블로그</h1>

      <div className="z-10 flex-row-center w-full justify-between">
        <SelectCategory
          options={CATEGORY_OPTIONS}
          position="bottomLeft"
        />
        <SelectSort position="bottomRight" />
      </div>

      <BlogContentSection posts={items} />

      <Pagination pagination={pagination} />
    </div>
  );
}
