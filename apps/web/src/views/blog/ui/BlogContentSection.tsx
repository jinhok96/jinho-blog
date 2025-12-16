import type { Blog } from '@jinho-blog/mdx-handler';
import type { PaginatedResult } from '@jinho-blog/shared';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';

import { Pagination } from '@/features/pagination';

type Props = {
  data: PaginatedResult<Blog>;
};

export async function BlogContentSection({ data }: Props) {
  const { items, pagination } = data;

  return (
    <div className="flex-col-start w-full gap-6">
      <Show
        when={items.length}
        fallback={ContentCardSection.Placeholder}
      >
        <ContentCardSection>
          {items.map(({ category, slug, path, ...post }) => (
            <ContentCardSection.Card
              key={slug}
              href={path}
              category={BLOG_CATEGORY_MAP[category]}
              {...post}
            />
          ))}
        </ContentCardSection>
      </Show>

      <Pagination
        pagination={pagination}
        showFirstLast
        maxPageButtons={5}
      />
    </div>
  );
}
