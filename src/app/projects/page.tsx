import type { Metadata } from 'next';

import { ROUTER } from '@/core/config';
import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection } from '@/core/ui';
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
      <h1 className="mb-8 text-4xl font-bold">프로젝트</h1>

      <ContentCardSection>
        {projects.map(({ category, slug, tech, ...items }) => (
          <ContentCardSection.Card
            key={slug}
            href={`${ROUTER.libraries}/${slug}`}
            category={PROJECT_CATEGORY_MAP[category]}
            {...items}
          >
            <ContentCardSection.TechBadgeList tech={tech} />
          </ContentCardSection.Card>
        ))}
      </ContentCardSection>
    </div>
  );
}
