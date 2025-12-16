import type { Blog } from '@jinho-blog/mdx-handler';
import type { BlogCategory, ContentSortOption, SearchParams } from '@jinho-blog/shared';
import type { PaginatedResult } from '@jinho-blog/shared';
import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { type SelectOption } from '@/core/ui';
import { generatePageMetadata, parseContentSearchParams } from '@/core/utils';

import { SelectCategory } from '@/features/selectCategory';
import { SelectSort } from '@/features/selectSort';

import { BlogContentSection } from '@/views/blog';

async function fetchBlogPosts(options: {
  category?: BlogCategory;
  sort?: ContentSortOption;
  page?: number;
  count?: number;
  search?: string;
}): Promise<PaginatedResult<Blog>> {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.sort) params.set('sort', options.sort);
  if (options.page) params.set('page', String(options.page));
  if (options.count) params.set('count', String(options.count));
  if (options.search) params.set('search', options.search);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blog posts');
  }

  return res.json();
}

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
  searchParams: Promise<SearchParams>;
};

export default async function BlogListPage({ searchParams }: Props) {
  const params = await searchParams;
  const parsed = parseContentSearchParams<BlogCategory>(params);

  const data = await fetchBlogPosts({
    category: Array.isArray(parsed.category) ? parsed.category[0] : parsed.category,
    sort: parsed.sort,
    page: parsed.page,
    count: parsed.count,
    search: parsed.search,
  });

  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">블로그</h1>

      <div className="z-10 flex-row-center w-full justify-between">
        <SelectCategory
          options={CATEGORY_OPTIONS}
          position="bottomLeft"
        />
        <SelectSort position="bottomRight" />
      </div>

      <BlogContentSection data={data} />
    </div>
  );
}
