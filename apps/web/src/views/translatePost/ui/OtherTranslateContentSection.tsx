import { TRANSLATE_CATEGORY_MAP, type TranslateCategory } from '@jinho-blog/shared';

import { ContentCardSection, Show } from '@/core/ui';

import { createTranslateService, type GetTranslatePosts } from '@/entities/translate';

import { Pagination } from '@/features/pagination';

const COUNT: number = 6;

const translateService = createTranslateService();

type Props = {
  category: TranslateCategory;
  page: string | string[] | undefined;
};

export async function OtherTranslateContentSection({ category, page }: Props) {
  const pageString = Array.isArray(page) ? page[0] : page;
  const search: GetTranslatePosts['search'] = { category, page: pageString, count: COUNT.toString() };

  const { items, pagination } = await translateService.getTranslatePosts(search);

  if (!items.length) return;

  return (
    <section className="w-full pt-20">
      <p className="pb-7 font-subtitle-22">
        <span className="font-bold text-blue-7">&apos;{TRANSLATE_CATEGORY_MAP[category]}&apos;</span> 카테고리 다른 글
      </p>

      <Show when={items.length}>
        <ContentCardSection>
          {items.map(({ category, slug, path, title, description, createdAt, thumbnail }) => (
            <ContentCardSection.Card
              key={slug}
              href={path}
              category={TRANSLATE_CATEGORY_MAP[category]}
              createdAt={createdAt}
              thumbnail={thumbnail}
              showThumbnail
            >
              <ContentCardSection.BlogInfo
                title={title}
                description={description}
              />
            </ContentCardSection.Card>
          ))}
        </ContentCardSection>
      </Show>

      <Pagination
        pagination={pagination}
        scroll={false}
      />
    </section>
  );
}
