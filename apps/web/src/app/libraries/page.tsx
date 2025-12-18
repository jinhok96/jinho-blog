import type { Metadata } from 'next';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';

import { generatePageMetadata, parseSearchParams } from '@/core/utils';

import { createLibrariesService, type GetLibraries } from '@/entities/libraries';

import { Pagination } from '@/features/pagination';

import { LibrariesContentSection } from '@/views/libraries';

const librariesService = createLibrariesService();

export const metadata: Metadata = generatePageMetadata({
  path: routes({ pathname: '/libraries' }),
  title: '라이브러리',
  description: '라이브러리 목록',
});

type Props = {
  searchParams: Promise<SearchParams<Record<keyof GetLibraries['search'], string | string[] | undefined>>>;
};

export default async function LibrariesListPage({ searchParams }: Props) {
  const { category, sort, tech, page, count, search } = await searchParams;

  const getLibrariesParams: GetLibraries['search'] = {
    category: parseSearchParams.category(category),
    sort: parseSearchParams.sort(sort),
    tech: parseSearchParams.tech(tech),
    page: parseSearchParams.page(page)?.toString(),
    count: parseSearchParams.count(count)?.toString(),
    search: parseSearchParams.search(search)?.join(','),
  };

  const { items, pagination } = await librariesService.getLibraries(getLibrariesParams);

  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">라이브러리</h1>

      <p>사이드바 목록, 모바일에서 드로어</p>

      <LibrariesContentSection libraries={items} />

      <Pagination pagination={pagination} />
    </div>
  );
}
