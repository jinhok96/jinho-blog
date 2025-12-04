import type { Metadata } from 'next';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { getProjects } from '@/entities/project';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'projects',
  title: '프로젝트',
  description: '프로젝트 목록',
});

export default async function ProjectsListPage() {
  const projects = await getProjects();

  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">프로젝트</h1>

      <div className="flex-row-center w-full justify-between">
        <div>카테고리, 화면을 모달로 띄우기 (Parallel Route)</div>
        <div>필터</div>
      </div>

      <ContentCardSection>
        {projects.map(({ category, slug, path, tech, ...items }) => (
          <ContentCardSection.Card
            key={slug}
            href={path}
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
