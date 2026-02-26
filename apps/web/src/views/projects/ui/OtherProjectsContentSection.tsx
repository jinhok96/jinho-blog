import { PROJECT_CATEGORY_MAP, type ProjectCategory } from '@jinho-blog/shared';

import { createProjectsService, type GetProjects } from '@/entities/projects';

import { Pagination } from '@/features/pagination';

import { ProjectsContentSection } from '@/views/projects/ui/ProjectsContentSection';

const COUNT: number = 6;

const projectsService = createProjectsService();

type Props = {
  category: ProjectCategory;
  page: string | string[] | undefined;
};

export async function OtherProjectsContentSection({ category, page }: Props) {
  const pageString = Array.isArray(page) ? page[0] : page;
  const search: GetProjects['search'] = { category, page: pageString, count: COUNT.toString() };

  const { items, pagination } = await projectsService.getProjects(search);

  if (!items.length) return;

  return (
    <section className="w-full pt-20">
      <p className="pb-7 font-subtitle-22">
        <span className="font-bold text-blue-7">&apos;{PROJECT_CATEGORY_MAP[category]}&apos;</span> 카테고리 다른 글
      </p>

      <ProjectsContentSection projects={items} />

      <Pagination
        pagination={pagination}
        scroll={false}
      />
    </section>
  );
}
