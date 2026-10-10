import type { Metadata } from 'next';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';
import { TRANSLATE_CATEGORIES, TRANSLATE_CATEGORY_MAP, type TranslateCategory } from '@jinho-blog/shared';

import { JsonLd, type SelectOption } from '@/core/ui';
import { generateCollectionPageJsonLd, generatePageMetadata, getCanonicalPage, parseSearchParams } from '@/core/utils';

import { createTranslateService, type GetTranslatePosts } from '@/entities/translate';

import { Pagination } from '@/features/pagination';
import { SelectCategory } from '@/features/selectCategory';
import { SelectSort } from '@/features/selectSort';

import { TranslateContentSection } from '@/views/translate';

const translateService = createTranslateService();

const PAGE_DESCRIPTION = '해외 기술 블로그의 주요 아티클을 한국어로 번역해 모았습니다.';

const jsonLd = generateCollectionPageJsonLd({
  title: '번역',
  description: PAGE_DESCRIPTION,
  path: routes({ pathname: '/translate' }),
});

const CATEGORY_OPTIONS: SelectOption<TranslateCategory>[] = TRANSLATE_CATEGORIES.map(category => ({
  key: category,
  label: TRANSLATE_CATEGORY_MAP[category],
}));

type Props = {
  searchParams: Promise<SearchParams<Record<keyof GetTranslatePosts['search'], string | string[] | undefined>>>;
};

// SEO: 페이지네이션은 각 페이지를 canonical로 지정하고, 정렬/필터/검색 결과는 기본 목록으로 정리
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = getCanonicalPage(await searchParams);

  return generatePageMetadata({
    path: routes({ pathname: '/translate', search: { page } }),
    title: page ? `번역 (${page}페이지)` : '번역',
    description: PAGE_DESCRIPTION,
  });
}

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
      {/* JSON-LD: CollectionPage */}
      <JsonLd jsonLd={jsonLd} />

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
