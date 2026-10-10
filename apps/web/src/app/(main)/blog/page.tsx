import type { Metadata } from 'next';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';
import { BLOG_CATEGORY_MAP, type BlogCategory } from '@jinho-blog/shared';

import { JsonLd, type SelectOption } from '@/core/ui';
import { generateCollectionPageJsonLd, generatePageMetadata, getCanonicalPage, parseSearchParams } from '@/core/utils';

import { createBlogService, type GetBlogPosts } from '@/entities/blog';

import { Pagination } from '@/features/pagination';
import { SelectCategory } from '@/features/selectCategory';
import { SelectSort } from '@/features/selectSort';

import { BlogContentSection } from '@/views/blog';

const blogService = createBlogService();

const PAGE_DESCRIPTION = '프론트엔드 개발, 알고리즘, CS 등 직접 겪은 문제와 해결 과정을 기록한 글 모음입니다.';

const jsonLd = generateCollectionPageJsonLd({
  title: '블로그',
  description: PAGE_DESCRIPTION,
  path: routes({ pathname: '/blog' }),
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

// SEO: 페이지네이션은 각 페이지를 canonical로 지정하고, 정렬/필터/검색 결과는 기본 목록으로 정리
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = getCanonicalPage(await searchParams);

  return generatePageMetadata({
    path: routes({ pathname: '/blog', search: { page } }),
    title: page ? `블로그 (${page}페이지)` : '블로그',
    description: PAGE_DESCRIPTION,
  });
}

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
      {/* JSON-LD: CollectionPage */}
      <JsonLd jsonLd={jsonLd} />

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
