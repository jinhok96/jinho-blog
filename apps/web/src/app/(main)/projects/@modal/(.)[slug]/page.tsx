import { notFound } from 'next/navigation';

import { RouteModal } from '@/core/ui';

import { createProjectsService } from '@/entities/projects';

import { ProjectDetail } from '@/views/projects';

const projectsService = createProjectsService();

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function InterceptedProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await projectsService.getProject({ slug });

  if (!project) notFound();

  const fileContent = await projectsService.getProjectContent({ slug });

  if (!fileContent) notFound();

  return (
    <RouteModal>
      <ProjectDetail
        project={project}
        fileContent={fileContent}
        modalView
      />
    </RouteModal>
  );
}
