import type { Project } from '@jinho-blog/mdx-handler';
import type { PaginatedResult } from '@jinho-blog/shared';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';

type Props = {
  projects: PaginatedResult<Project>['items'];
};

export async function ProjectsContentSection({ projects }: Props) {
  return (
    <div className="flex-col-start w-full gap-6">
      <Show
        when={projects.length}
        fallback={ContentCardSection.Placeholder}
      >
        <ContentCardSection>
          {projects.map(({ category, slug, path, tech, title, description, createdAt, period, members }) => (
            <ContentCardSection.Card
              key={slug}
              href={path}
              scroll={false}
              category={PROJECT_CATEGORY_MAP[category]}
              title={title}
              description={description}
              createdAt={createdAt}
              period={period}
              members={members}
            >
              <ContentCardSection.TechBadgeList tech={tech} />
            </ContentCardSection.Card>
          ))}
        </ContentCardSection>
      </Show>
    </div>
  );
}
