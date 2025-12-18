import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';

import { ContentDetailWrapper } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { createProjectsService } from '@/entities/projects';

import { ProjectDetail } from '@/views/projects';

const projectsService = createProjectsService();

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await projectsService.getProject({ slug });

  if (!project) return {};

  return generatePageMetadata({
    path: routes({ pathname: '/projects/[slug]', params: { slug } }),
    title: project.title,
    description: project.description,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await projectsService.getProject({ slug });

  if (!project) notFound();

  const fileContent = await projectsService.getProjectContent({ slug });

  if (!fileContent) notFound();

  return (
    <ContentDetailWrapper rootHref={routes({ pathname: '/projects' })}>
      <ProjectDetail
        project={project}
        fileContent={fileContent}
      />
    </ContentDetailWrapper>
  );
}
