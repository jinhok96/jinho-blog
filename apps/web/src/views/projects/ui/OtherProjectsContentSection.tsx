'use client';

import type { Project } from '@jinho-blog/mdx-handler';

import { PROJECT_CATEGORY_MAP, type ProjectCategory } from '@jinho-blog/shared';

import { Pagination, useClientPagination } from '@/features/pagination';

import { ProjectsContentSection } from '@/views/projects/ui/ProjectsContentSection';

const COUNT: number = 6;

type Props = {
  category: ProjectCategory;
  /** 해당 카테고리의 전체 목록. 페이지 분할은 클라이언트에서 처리한다 */
  projects: Project[];
};

export function OtherProjectsContentSection({ category, projects }: Props) {
  const { pagination, startIndex, endIndex, setPage } = useClientPagination({
    totalItems: projects.length,
    itemsPerPage: COUNT,
  });

  if (!projects.length) return null;

  const items = projects.slice(startIndex, endIndex);

  return (
    <section
      className="w-full pt-20"
      aria-labelledby="other-projects-heading"
    >
      <h2
        id="other-projects-heading"
        className="pb-7 font-subtitle-22"
      >
        <span className="font-bold text-blue-7">&apos;{PROJECT_CATEGORY_MAP[category]}&apos;</span> 카테고리 다른 글
      </h2>

      <ProjectsContentSection projects={items} />

      <Pagination
        pagination={pagination}
        onPageChange={setPage}
      />
    </section>
  );
}
