import type { Library } from '@jinho-blog/mdx-handler';
import type { PaginatedResult } from '@jinho-blog/shared';

import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';

type Props = {
  libraries: PaginatedResult<Library>['items'];
};

export async function LibrariesContentSection({ libraries }: Props) {
  return (
    <div className="flex-col-start w-full gap-6">
      <Show
        when={libraries.length}
        fallback={ContentCardSection.Placeholder}
      >
        <ContentCardSection>
          {libraries.map(({ category, slug, path, tech, title, description, createdAt }) => (
            <ContentCardSection.Card
              key={slug}
              href={path}
              category={LIBRARY_CATEGORY_MAP[category]}
              title={title}
              createdAt={createdAt}
            >
              <ContentCardSection.LibraryInfo description={description} />
              <ContentCardSection.TechStacks stacks={tech} />
            </ContentCardSection.Card>
          ))}
        </ContentCardSection>
      </Show>
    </div>
  );
}
