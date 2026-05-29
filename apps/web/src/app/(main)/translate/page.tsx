import type { Metadata } from 'next';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';
import { TRANSLATE_CATEGORIES, TRANSLATE_CATEGORY_MAP, type TranslateCategory } from '@jinho-blog/shared';

import { type SelectOption } from '@/core/ui';
import { generatePageMetadata, parseSearchParams } from '@/core/utils';

import { createTranslateService, type GetTranslatePosts } from '@/entities/translate';

import { Pagination } from '@/features/pagination';
import { SelectCategory } from '@/features/selectCategory';
import { SelectSort } from '@/features/selectSort';

import { TranslateContentSection } from '@/views/translate';

const translateService = createTranslateService();

export const metadata: Metadata = generatePageMetadata({
  path: routes({ pathname: '/translate' }),
  title: '번역',
});

const CATEGORY_OPTIONS: SelectOption<TranslateCategory>[] = TRANSLATE_CATEGORIES.map(category => ({
  key: category,
  label: TRANSLATE_CATEGORY_MAP[category],
}));

type Props = {
  searchParams: Promise<SearchParams<Record<keyof GetTranslatePosts['search'], string | string[] | undefined>>>;
};

export default async function TranslateListPage({ searchParams }: Props) {
  const { category, sort, page, count, search } = await searchParams;

  const getTranslatePostsParams: GetTranslatePosts['search'] = {
    category: parseSearchParams.category(category) as TranslateCategory | undefined,
    sort: parseSearchParams.sort(sort),
    page: parseSearchParams.page(page)?.toString(),
    count: parseSearchParams.count(count)?.toString(),
    search: parseSearchParams.search(search)?.join(','),
  };

  const { items, pagination } = await translateService.getTranslatePosts(getTranslatePostsParams);

  return (
    <div className="flex-col-start size-full flex-1 gap-6">
      <h1 className="font-title-36">번역</h1>

      <div className="z-10 flex-row-center w-full justify-between">
        <SelectCategory
          options={CATEGORY_OPTIONS}
          position="bottomLeft"
        />
        <SelectSort position="bottomRight" />
      </div>

      <TranslateContentSection posts={items} />

      <Pagination pagination={pagination} />
    </div>
  );
}
