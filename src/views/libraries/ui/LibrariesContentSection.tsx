import type { LibraryCategory, SearchParams } from '@/core/types/internal';

import { LIBRARY_CATEGORY_MAP } from '@/core/map/internal';
import { ContentCardSection, Show } from '@/core/ui';
import { parseContentSearchParams } from '@/core/utils';

import { getLibraries } from '@/entities/library';

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function LibrariesContentSection({ searchParams }: Props) {
  const params = await searchParams;
  const options = parseContentSearchParams<LibraryCategory>(params);

  const libraries = await getLibraries(options);

  return (
    <ContentCardSection>
      <Show
        when={libraries.length}
        fallback={ContentCardSection.Placeholder}
      >
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
      </Show>
    </ContentCardSection>
  );
}
