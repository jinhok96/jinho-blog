import type { Project } from '@jinho-blog/mdx-handler';
import type { ComponentProps } from 'react';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentHeader, MDXComponent } from '@/core/ui';

type Props = Pick<ComponentProps<typeof MDXComponent>, 'isModalView'> & {
  project: Project;
  fileContent: string;
};

export function ProjectDetail({ project, fileContent, isModalView }: Props) {
  const { title, category, description, createdAt, updatedAt, tech, period, members, links } = project;

  return (
    <>
      <ContentHeader
        category={PROJECT_CATEGORY_MAP[category]}
        title={title}
        createdAt={createdAt}
        updatedAt={updatedAt}
        description={description}
        tech={tech}
        period={period}
        members={members}
        links={links}
        isModalView={isModalView}
      />

      <MDXComponent
        fileContent={fileContent}
        isModalView={isModalView}
      />
    </>
  );
}
