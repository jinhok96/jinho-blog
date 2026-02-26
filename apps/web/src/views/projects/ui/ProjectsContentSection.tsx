import type { Project } from '@jinho-blog/mdx-handler';

import { type PaginatedResult, PROJECT_CATEGORY_MAP } from '@jinho-blog/shared';

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
              createdAt={createdAt}
            >
              <ContentCardSection.ProjectInfo
                title={title}
                period={period}
                members={members}
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
