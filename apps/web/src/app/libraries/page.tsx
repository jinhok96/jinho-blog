import type { ContentSortOption, LibraryCategory, SearchParams } from '@jinho-blog/shared';
import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';

import { generatePageMetadata, parseContentSearchParams } from '@/core/utils';

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
  searchParams: Promise<SearchParams>;
};

export default async function LibrariesListPage({ searchParams }: Props) {
  const params = await searchParams;
  const { category, sort, page, count, search } = parseContentSearchParams<LibraryCategory, ContentSortOption>(params);

  const getLibrariesParams: GetLibraries['Params'] = {};

  if (category) getLibrariesParams.category = Array.isArray(category) ? category[0] : category;
  if (sort) getLibrariesParams.sort = sort;
  if (typeof page === 'number') getLibrariesParams.page = page.toString();
  if (typeof count === 'number') getLibrariesParams.count = count.toString();
  if (search) getLibrariesParams.search = Array.isArray(search) ? search.join(',') : search;

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
