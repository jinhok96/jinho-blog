import type { BlogCategory } from '@jinho-blog/shared';

import { BLOG_CATEGORY_MAP } from '@/core/map';

import { createBlogService, type GetBlogPosts } from '@/entities/blog';

import { Pagination } from '@/features/pagination';

import { BlogContentSection } from '@/views/blog/ui/BlogContentSection';

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
        <span className="font-bold text-blue-7">{BLOG_CATEGORY_MAP[category]}</span> 카테고리 다른 글
      </p>

      <BlogContentSection posts={items} />

      <Pagination
        pagination={pagination}
        scroll={false}
      />
    </section>
  );
}
