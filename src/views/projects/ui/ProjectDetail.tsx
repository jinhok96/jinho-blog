import type { Project } from '@/entities/project';
import type { ComponentProps } from 'react';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentHeader, MDXComponent } from '@/core/ui';

type Props = Pick<ComponentProps<typeof MDXComponent>, 'modalView'> & {
  project: Project;
  fileContent: string;
};

export function ProjectDetail({ project, fileContent, modalView }: Props) {
  const { title, category, createdAt, updatedAt, tech } = project;

  return (
    <div className="size-full">
      <ContentHeader
        category={PROJECT_CATEGORY_MAP[category]}
        title={title}
        createdAt={createdAt}
        updatedAt={updatedAt}
        tech={tech}
        modalView={modalView}
      />

      <MDXComponent
        fileContent={fileContent}
        modalView={modalView}
      />
    </div>
  );
}
