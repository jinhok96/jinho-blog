import type { ContentSortOption, ProjectCategory, SearchParams } from '@jinho-blog/shared';
import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { SafeHTML, type SelectOption } from '@/core/ui';
import { generatePageMetadata, nbsp, parseContentSearchParams } from '@/core/utils';

import { createProjectsService, type GetProjects } from '@/entities/projects';

import { Pagination } from '@/features/pagination';
import { SelectCategory } from '@/features/selectCategory';
import { SelectSort } from '@/features/selectSort';

import { ProjectsContentSection } from '@/views/projects';

const projectsService = createProjectsService();

export const metadata: Metadata = generatePageMetadata({
  path: routes({ pathname: '/projects' }),
  title: '프로젝트',
  description: '프로젝트 목록',
});

const CATEGORY_OPTIONS: SelectOption<ProjectCategory>[] = [
  { key: 'tripmoney', label: PROJECT_CATEGORY_MAP.tripmoney },
  { key: 'personal', label: <SafeHTML html={nbsp(PROJECT_CATEGORY_MAP.personal)} /> },
];

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ProjectsListPage({ searchParams }: Props) {
  const params = await searchParams;
  const { category, sort, page, count, search } = parseContentSearchParams<ProjectCategory, ContentSortOption>(params);

  const getProjectsParams: GetProjects['Params'] = {};

  if (category) getProjectsParams.category = Array.isArray(category) ? category[0] : category;
  if (sort) getProjectsParams.sort = sort;
  if (typeof page === 'number') getProjectsParams.page = page.toString();
  if (typeof count === 'number') getProjectsParams.count = count.toString();
  if (search) getProjectsParams.search = Array.isArray(search) ? search.join(',') : search;

  const { items, pagination } = await projectsService.getProjects(getProjectsParams);

  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">프로젝트</h1>

      <div className="z-10 flex-row-center w-full justify-between">
        <SelectCategory
          options={CATEGORY_OPTIONS}
          position="bottomLeft"
        />
        <SelectSort position="bottomRight" />
      </div>

      <ProjectsContentSection projects={items} />

      <Pagination pagination={pagination} />
    </div>
  );
}
