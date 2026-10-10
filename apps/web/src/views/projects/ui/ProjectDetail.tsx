import type { Project } from '@/entities/projects';

import { PROJECT_CATEGORY_MAP } from '@jinho-blog/shared';

import { ContentHeader, MDXComponent } from '@/core/ui';

type Props = {
  project: Project;
  fileContent: string;
};

export function ProjectDetail({ project, fileContent }: Props) {
  const { title, category, description, tech, period, members, links } = project;

  return (
    <>
      <ContentHeader
        category={PROJECT_CATEGORY_MAP[category]}
        title={title}
        isModalView
      >
        <ContentHeader.ProjectInfo
          period={period}
          members={members}
          description={description}
          links={links}
        />

        <ContentHeader.TechStacks stacks={tech} />
      </ContentHeader>

      <MDXComponent
        fileContent={fileContent}
        hideTableOfContents
      />
    </>
  );
}
