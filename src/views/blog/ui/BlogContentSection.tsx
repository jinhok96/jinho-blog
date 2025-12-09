import type { BlogCategory, SearchParams } from '@/core/types';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';
import { parseContentSearchParams } from '@/core/utils';

import { getBlogPosts } from '@/entities/blog';

import { Pagination } from '@/features/pagination';

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function BlogContentSection({ searchParams }: Props) {
  const params = await searchParams;
  const options = parseContentSearchParams<BlogCategory>(params);

  const { items: posts, pagination } = await getBlogPosts(options);

  return (
    <div className="flex-col-start w-full gap-6">
      <Show
        when={posts.length}
        fallback={ContentCardSection.Placeholder}
      >
        <ContentCardSection>
          {posts.map(({ category, slug, path, ...post }) => (
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
