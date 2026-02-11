import type { GetProjectsOptions, MdxInfo, PaginatedResult, ProjectMetadata } from '@jinho-blog/shared';

import { MDX_ROUTES } from '../../core/config';
import {
  filterByCategory,
  filterByTechStack,
  getRegistry,
  paginateContentWithMeta,
  type RegistryEntry,
  searchContent,
  sortContent,
} from '../../core/utils';

export type Project = ProjectMetadata & MdxInfo & RegistryEntry;

/**
 * 프로젝트 목록 조회
 */
export async function getProjects(options?: GetProjectsOptions): Promise<PaginatedResult<Project>> {
  const { category, sort, page, tech, count, search } = options || {};

  let data = getRegistry<Project>('projects', MDX_ROUTES);

  data = filterByCategory(data, category);
  data = filterByTechStack(data, tech);
  data = searchContent<Project, keyof ProjectMetadata>(data, ['title', 'description', 'tech'], search);
  data = sortContent(data, sort);

  return paginateContentWithMeta(data, page, count);
}

/**
 * 단일 프로젝트 조회
 */
export async function getProject(slug: string): Promise<Project | null> {
  const registry = getRegistry<Project>('projects', MDX_ROUTES);
  return registry.find(project => project.slug === slug) || null;
}

/**
 * MDX 콘텐츠 읽기
 */
export async function getProjectContent(slug: string): Promise<string | null> {
  const project = await getProject(slug);
  if (!project || !project.content) return null;

  return project.content as string;
}
