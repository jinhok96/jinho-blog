import type { BlogCategory } from '@jinho-blog/shared';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';

import { createBlogService, type GetBlogPosts } from '@/entities/blog';

import { Pagination } from '@/features/pagination';

const COUNT: number = 6;

const blogService = createBlogService();

type Props = {
  category: BlogCategory;
  page: string | string[] | undefined;
};

export async function OtherBlogContentSection({ category, page }: Props) {
  const pageString = Array.isArray(page) ? page[0] : page;
  const search: GetBlogPosts['search'] = { category, page: pageString, count: COUNT.toString() };

  const { items, pagination } = await blogService.getBlogPosts(search);

  if (!items.length) return;

  return (
    <section className="w-full pt-20">
      <p className="pb-7 font-subtitle-22">
        <span className="font-bold text-blue-7">&apos;{BLOG_CATEGORY_MAP[category]}&apos;</span> 카테고리 다른 글
      </p>

      <Show when={items.length}>
        <ContentCardSection>
          {items.map(({ category, slug, path, title, description, createdAt }) => (
            <ContentCardSection.Card
              key={slug}
              href={path}
              category={BLOG_CATEGORY_MAP[category]}
              title={title}
              description={description}
              createdAt={createdAt}
            />
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
