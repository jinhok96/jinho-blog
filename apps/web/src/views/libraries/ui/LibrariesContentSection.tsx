import type { LibraryCategory, PaginatedResult, SearchParams } from '@/core/types';
import type { Library } from '@jinho-blog/mdx-handler';

import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';
import { parseContentSearchParams } from '@/core/utils';

import { Pagination } from '@/features/pagination';

type Props = {
  searchParams: Promise<SearchParams>;
};

async function fetchLibraries(options: {
  category?: LibraryCategory;
  sort?: 'latest' | 'oldest' | 'updated';
  page?: number;
  count?: number;
  search?: string;
}): Promise<PaginatedResult<Library>> {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.sort) params.set('sort', options.sort);
  if (options.page) params.set('page', String(options.page));
  if (options.count) params.set('count', String(options.count));
  if (options.search) params.set('search', options.search);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/libraries?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error('Failed to fetch libraries');
  return res.json();
}

export async function LibrariesContentSection({ searchParams }: Props) {
  const params = await searchParams;
  const parsed = parseContentSearchParams<LibraryCategory>(params);

  const { items: libraries, pagination } = await fetchLibraries({
    category: Array.isArray(parsed.category) ? parsed.category[0] : parsed.category,
    sort: parsed.sort,
    page: parsed.page,
    count: parsed.count,
    search: parsed.search,
  });

  return (
    <div className="flex-col-start w-full gap-6">
      <Show
        when={libraries.length}
        fallback={ContentCardSection.Placeholder}
      >
        <ContentCardSection>
          {libraries.map(({ category, slug, path, tech, ...items }) => (
            <ContentCardSection.Card
              key={slug}
              href={path}
              category={LIBRARY_CATEGORY_MAP[category]}
              {...items}
            >
              <ContentCardSection.TechBadgeList tech={tech} />
            </ContentCardSection.Card>
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
