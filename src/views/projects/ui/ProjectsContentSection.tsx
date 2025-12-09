import type { ProjectCategory, SearchParams } from '@/core/types';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';
import { parseContentSearchParams } from '@/core/utils';

import { getProjects } from '@/entities/project';

import { Pagination } from '@/features/pagination';

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function ProjectsContentSection({ searchParams }: Props) {
  const params = await searchParams;
  const options = parseContentSearchParams<ProjectCategory>(params);

  const { items: projects, pagination } = await getProjects(options);

  return (
    <div className="flex-col-start w-full gap-6">
      <Show
        when={projects.length}
        fallback={ContentCardSection.Placeholder}
      >
        <ContentCardSection>
          {projects.map(({ category, slug, path, tech, ...items }) => (
            <ContentCardSection.Card
              key={slug}
              href={path}
              category={PROJECT_CATEGORY_MAP[category]}
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
