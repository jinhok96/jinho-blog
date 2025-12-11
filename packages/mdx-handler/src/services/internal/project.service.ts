import type { GetProjectsOptions, MdxInfo, PaginatedResult, ProjectMetadata } from '@jinho-blog/shared';

import { ROUTER } from '../../config';
import { parseMdxFile } from '../../core/internal/parser';
import { getRegistry, type RegistryEntry } from '../../core/internal/registry';
import { filterByCategory, paginateContentWithMeta, searchContent, sortContent } from '../../utils/internal/content';

export type Project = ProjectMetadata & MdxInfo & RegistryEntry;

/**
 * 프로젝트 목록 조회
 */
export async function getProjects(options?: GetProjectsOptions): Promise<PaginatedResult<Project>> {
  const { category, sort = 'latest', page = 1, count = 12, search } = options || {};

  let projects = getRegistry<Project>('projects', ROUTER);

  projects = filterByCategory(projects, category);
  projects = searchContent(projects, search);
  projects = sortContent(projects, sort);

  return paginateContentWithMeta(projects, page, count);
}

/**
 * 단일 프로젝트 조회
 */
export async function getProject(slug: string): Promise<Project | null> {
  const registry = getRegistry<Project>('projects', ROUTER);
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
