'use client';

import type { Blog } from '@jinho-blog/mdx-handler';

import { BLOG_CATEGORY_MAP, type BlogCategory } from '@jinho-blog/shared';

import { ContentCardSection, Show } from '@/core/ui';

import { Pagination, useClientPagination } from '@/features/pagination';

const COUNT: number = 6;

type Props = {
  category: BlogCategory;
  /** 해당 카테고리의 전체 목록. 페이지 분할은 클라이언트에서 처리한다 */
  posts: Blog[];
};

export function OtherBlogContentSection({ category, posts }: Props) {
  const { pagination, startIndex, endIndex, setPage } = useClientPagination({
    totalItems: posts.length,
    itemsPerPage: COUNT,
  });

  if (!posts.length) return null;

  const items = posts.slice(startIndex, endIndex);

  return (
    <section
      className="w-full pt-20"
      aria-labelledby="other-blog-heading"
    >
      <h2
        id="other-blog-heading"
        className="pb-7 font-subtitle-22"
      >
        <span className="font-bold text-blue-7">&apos;{BLOG_CATEGORY_MAP[category]}&apos;</span> 카테고리 다른 글
      </h2>

      <Show when={items.length}>
        <ContentCardSection>
          {items.map(({ category, slug, path, title, description, createdAt, thumbnail }) => (
            <ContentCardSection.Card
              key={slug}
              href={path}
              category={BLOG_CATEGORY_MAP[category]}
              createdAt={createdAt}
              thumbnail={thumbnail}
              title={title}
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
        onPageChange={setPage}
      />
    </section>
  );
}
