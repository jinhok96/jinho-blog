import type { Metadata } from 'next';

import { AsyncBoundary } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { ProjectsContentSection } from '@/views/projects';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'projects',
  title: '프로젝트',
  description: '프로젝트 목록',
});

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsListPage({ searchParams }: Props) {
  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">프로젝트</h1>

      <div className="flex-row-center w-full justify-between">
        <div>카테고리, 화면을 모달로 띄우기 (Parallel Route)</div>
        <div>필터</div>
      </div>

      <AsyncBoundary>
        <ProjectsContentSection searchParams={searchParams} />
      </AsyncBoundary>
    </div>
  );
}
