import type { Library } from '@jinho-blog/mdx-handler';

import { LIBRARY_CATEGORY_MAP, type PaginatedResult } from '@jinho-blog/shared';

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
              createdAt={createdAt}
            >
              <ContentCardSection.LibraryInfo
                title={title}
                description={description}
              />
              <ContentCardSection.TechStacks stacks={tech} />
            </ContentCardSection.Card>
          ))}
        </ContentCardSection>
      </Show>
    </div>
  );
}
