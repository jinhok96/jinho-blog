import type { GetProjectsOptions, PaginatedResult } from '@/core/types';
import type { Project } from '@/entities/project/types/types';

import { filterByCategory, paginateContentWithMeta, searchContent, sortContent } from '@/core/utils';

import { projectsRegistry } from '@/entities/project/registry.generated';

export async function getProjects(options?: GetProjectsOptions): Promise<PaginatedResult<Project>> {
  const { category, sort = 'latest', page = 1, count = 12, search } = options || {};

  let projects = projectsRegistry;

  // 1. 카테고리 필터링 (단일 또는 복수)
  projects = filterByCategory(projects, category);

  // 2. 텍스트 검색
  projects = searchContent(projects, search);

  // 3. 정렬
  projects = sortContent(projects, sort);

  // 4. 페이지네이션 with metadata
  return paginateContentWithMeta(projects, page, count);
}

export async function getProject(slug: string): Promise<Project | null> {
  return projectsRegistry.find(p => p.slug === slug) || null;
}
