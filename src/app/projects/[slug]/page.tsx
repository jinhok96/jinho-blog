import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { readFileSync } from 'fs';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentHeader, MDXComponent } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { getProject, getProjects } from '@/entities/project';

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG: 빌드 시 모든 경로 생성
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(project => ({ slug: project.slug }));
}

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return {};

  return generatePageMetadata({
    routerName: 'projects',
    title: project.title,
    description: project.description,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const { title, category, createdAt, updatedAt, tech, filePath } = project;

  const fileContent = readFileSync(filePath, 'utf-8');

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
