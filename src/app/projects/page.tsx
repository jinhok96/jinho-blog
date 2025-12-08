import type { ProjectCategory } from '@/core/types';
import type { Metadata } from 'next';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { AsyncBoundary, SafeHTML, type SelectOption } from '@/core/ui';
import { generatePageMetadata, nbsp } from '@/core/utils';

import { SelectCategory } from '@/features/selectCategory';
import { SelectSort } from '@/features/selectSort';

import { ProjectsContentSection } from '@/views/projects';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'projects',
  title: '프로젝트',
  description: '프로젝트 목록',
});

const CATEGORY_OPTIONS: SelectOption<ProjectCategory>[] = [
  { key: 'tripmoney', label: PROJECT_CATEGORY_MAP.tripmoney },
  { key: 'personal', label: <SafeHTML html={nbsp(PROJECT_CATEGORY_MAP.personal)} /> },
];

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsListPage({ searchParams }: Props) {
  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">프로젝트</h1>

      <div className="z-10 flex-row-center w-full justify-between">
        <AsyncBoundary>
          <SelectCategory
            options={CATEGORY_OPTIONS}
            position="bottomLeft"
          />
        </AsyncBoundary>
        <AsyncBoundary>
          <SelectSort position="bottomRight" />
        </AsyncBoundary>
      </div>

      <div>화면을 모달로 띄우기 (Parallel Route)</div>

      <AsyncBoundary>
        <ProjectsContentSection searchParams={searchParams} />
      </AsyncBoundary>
    </div>
  );
}
