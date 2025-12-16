import type { GetProjectsOptions, MdxInfo, PaginatedResult, ProjectMetadata } from '@jinho-blog/shared';

import { MDX_ROUTES } from '../../core/config';
import {
  getRegistry,
  type RegistryEntry,
  parseMdxFile,
  filterByCategory,
  paginateContentWithMeta,
  searchContent,
  sortContent,
} from '../../core/utils';

export type Project = ProjectMetadata & MdxInfo & RegistryEntry;

/**
 * 프로젝트 목록 조회
 */
export async function getProjects(options?: GetProjectsOptions): Promise<PaginatedResult<Project>> {
  const { category, sort, page, count, search } = options || {};

  let projects = getRegistry<Project>('projects', MDX_ROUTES);

  projects = filterByCategory(projects, category);
  projects = searchContent<Project, keyof ProjectMetadata>(projects, ['title', 'description', 'tech'], search);
  projects = sortContent(projects, sort);

  return paginateContentWithMeta(projects, page, count);
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
  if (!project) return null;

  const { content } = parseMdxFile(project.filePath);
  return content;
}
