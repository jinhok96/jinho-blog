import type { Project } from '@jinho-blog/mdx-handler';
import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';

import { ContentDetailWrapper } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { ProjectDetail } from '@/views/projects';

type Props = {
  params: Promise<{ slug: string }>;
};

async function fetchProject(slug: string): Promise<Project | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/projects/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  return res.json();
}

async function fetchProjectContent(slug: string): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/projects/${slug}/content`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const { content } = await res.json();
  return content;
}

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) return {};

  return generatePageMetadata({
    path: routes({ pathname: '/projects/[slug]', params: { slug } }),
    title: project.title,
    description: project.description,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) notFound();

  const fileContent = await fetchProjectContent(slug);

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
