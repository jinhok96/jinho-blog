import type { Metadata } from 'next';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';
import { PROJECT_CATEGORY_MAP, type ProjectCategory } from '@jinho-blog/shared';

import { SafeHTML, type SelectOption } from '@/core/ui';
import { generatePageMetadata, nbsp, parseSearchParams } from '@/core/utils';

import { createProjectsService, type GetProjects } from '@/entities/projects';

import { Pagination } from '@/features/pagination';
import { SelectCategory } from '@/features/selectCategory';
import { SelectSort } from '@/features/selectSort';

import { ProjectsContentSection } from '@/views/projects';

const projectsService = createProjectsService();

export const metadata: Metadata = generatePageMetadata({
  path: routes({ pathname: '/projects' }),
  title: '프로젝트',
});

const CATEGORY_OPTIONS: SelectOption<ProjectCategory>[] = [
  { key: 'tripmoney', label: PROJECT_CATEGORY_MAP.tripmoney },
  { key: 'personal', label: <SafeHTML html={nbsp(PROJECT_CATEGORY_MAP.personal)} /> },
];

type Props = {
  searchParams: Promise<SearchParams<Record<keyof GetProjects['search'], string | string[] | undefined>>>;
};

export default async function ProjectsListPage({ searchParams }: Props) {
  const { category, sort, tech, page, count, search } = await searchParams;

  const getProjectsParams: GetProjects['search'] = {
    category: parseSearchParams.category(category),
    sort: parseSearchParams.sort(sort),
    tech: parseSearchParams.tech(tech),
    page: parseSearchParams.page(page)?.toString(),
    count: parseSearchParams.count(count)?.toString(),
    search: parseSearchParams.search(search)?.join(','),
  };

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
