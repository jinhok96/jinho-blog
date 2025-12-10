import type { Project } from '@jinho-blog/mdx-handler';

import { notFound } from 'next/navigation';

import { RouteModal } from '@/core/ui';

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

export default async function InterceptedProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) notFound();

  const fileContent = await fetchProjectContent(slug);

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
