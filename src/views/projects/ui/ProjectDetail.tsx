import type { Project } from '@/entities/project';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentHeader, MDXComponent } from '@/core/ui';

type Props = {
  project: Project;
  fileContent: string;
};

export function ProjectDetail({ project, fileContent }: Props) {
  const { title, category, createdAt, updatedAt, tech } = project;

  return (
    <article className="size-full">
      <ContentHeader
        category={PROJECT_CATEGORY_MAP[category]}
        title={title}
        createdAt={createdAt}
        updatedAt={updatedAt}
        tech={tech}
      />

      <MDXComponent fileContent={fileContent} />
    </article>
  );
}
