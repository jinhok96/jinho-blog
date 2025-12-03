import type { Metadata } from 'next';

import { ROUTER } from '@/core/config';
import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentCard } from '@/core/ui';
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
        {projects.map(({ category, slug, ...post }) => (
          <ContentCard
            key={slug}
            href={`${ROUTER.projects}/${slug}`}
            category={PROJECT_CATEGORY_MAP[category]}
            {...post}
          />
        ))}
      </div>
    </div>
  );
}
