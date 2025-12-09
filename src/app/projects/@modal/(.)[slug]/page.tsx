import { notFound } from 'next/navigation';

import { readFileSync } from 'fs';

import { RouteModal } from '@/core/ui';

import { getProject, getProjects } from '@/entities/project';

import { ProjectDetail } from '@/views/projects';

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG: 빌드 시 모든 모달 경로 생성
export async function generateStaticParams() {
  const { items: projects } = await getProjects();
  return projects.map(project => ({ slug: project.slug }));
}

export default async function InterceptedProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const fileContent = readFileSync(project.filePath, 'utf-8');

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
