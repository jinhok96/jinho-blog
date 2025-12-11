import type { Blog } from '@jinho-blog/mdx-handler';
import type { BlogCategory, PaginatedResult, SearchParams } from '@jinho-blog/shared';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';
import { parseContentSearchParams } from '@/core/utils';

import { Pagination } from '@/features/pagination';

type Props = {
  searchParams: Promise<SearchParams>;
};

async function fetchBlogPosts(options: {
  category?: BlogCategory;
  sort?: 'latest' | 'oldest' | 'updated';
  page?: number;
  count?: number;
  search?: string;
}): Promise<PaginatedResult<Blog>> {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.sort) params.set('sort', options.sort);
  if (options.page) params.set('page', String(options.page));
  if (options.count) params.set('count', String(options.count));
  if (options.search) params.set('search', options.search);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blog posts');
  }

  return res.json();
}

export async function BlogContentSection({ searchParams }: Props) {
  const params = await searchParams;
  const parsed = parseContentSearchParams<BlogCategory>(params);

  const { items: posts, pagination } = await fetchBlogPosts({
    category: Array.isArray(parsed.category) ? parsed.category[0] : parsed.category,
    sort: parsed.sort,
    page: parsed.page,
    count: parsed.count,
    search: parsed.search,
  });

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
