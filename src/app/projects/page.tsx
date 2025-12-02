import type { Metadata } from 'next';

import Link from 'next/link';

import { generatePageMetadata } from '@/core/utils';

import { getProjects } from '@/entities/project';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'projects',
  title: 'Projects',
  description: '프로젝트 목록',
});

export default async function ProjectsListPage() {
  const projects = await getProjects();

  return (
    <div className="size-full">
      <h1 className="mb-8 text-4xl font-bold">Projects</h1>
      <div
        className={`
          grid grid-cols-1 gap-6
          md:grid-cols-2
          lg:grid-cols-3
        `}
      >
        {projects.map(project => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`
              block rounded-lg border p-6 transition-shadow
              hover:shadow-lg
            `}
          >
            <h2 className="mb-2 text-xl font-bold">{project.title}</h2>
            <p className="mb-4 text-gray-600">{project.description}</p>
            {project.tech.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tech.map(tech => (
                  <span
                    key={tech}
                    className="rounded-sm bg-blue-100 px-2 py-1 text-sm text-blue-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
