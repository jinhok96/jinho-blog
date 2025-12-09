import type { LibraryCategory, SearchParams } from '@/core/types';

import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';
import { parseContentSearchParams } from '@/core/utils';

import { getLibraries } from '@/entities/library';

import { Pagination } from '@/features/pagination';

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function LibrariesContentSection({ searchParams }: Props) {
  const params = await searchParams;
  const options = parseContentSearchParams<LibraryCategory>(params);

  const { items: libraries, pagination } = await getLibraries(options);

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
