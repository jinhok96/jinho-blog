import type { ProjectCategory, SearchParams } from '@/core/types/internal';

import { PROJECT_CATEGORY_MAP } from '@/core/map/internal';
import { ContentCardSection, Show } from '@/core/ui';
import { parseContentSearchParams } from '@/core/utils';

import { getProjects } from '@/entities/project';

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function ProjectsContentSection({ searchParams }: Props) {
  const params = await searchParams;
  const options = parseContentSearchParams<ProjectCategory>(params);

  const projects = await getProjects(options);

  return (
    <ContentCardSection>
      <Show
        when={projects.length}
        fallback={ContentCardSection.Placeholder}
      >
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
      </Show>
    </ContentCardSection>
  );
}
