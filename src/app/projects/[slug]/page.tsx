import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { MDXComponent } from '@/core/mdx';
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

  const { title, description, tech, filePath } = project;

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 text-4xl font-bold">{title}</h1>
      <p className="mb-8 text-gray-600">{description}</p>
      <div className="mb-8 flex flex-wrap gap-2">
        {tech.map(tech => (
          <span
            key={tech}
            className="rounded-sm bg-blue-100 px-3 py-1 text-sm text-blue-700"
          >
            {tech}
          </span>
        ))}
      </div>

      <MDXComponent filePath={filePath} />
    </article>
  );
}
