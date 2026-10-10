import type { GetProject, GetProjectContent, GetProjects, Project } from '@/entities/projects/types';
import type { GetProjectsOptions, PaginatedResult } from '@jinho-blog/shared';

import {
  filterByCategory,
  filterByTechStack,
  paginateContentWithMeta,
  searchContent,
  sortContent,
} from '@jinho-blog/mdx-handler';

import { contentReader } from '@/core/content';

/**
 * 프로젝트 목록 조회
 */
async function getProjects(options?: GetProjectsOptions): Promise<PaginatedResult<Project>> {
  const { category, sort, page, tech, count, search } = options || {};

  let data = contentReader.getEntries('projects');

  data = filterByCategory(data, category);
  data = filterByTechStack(data, tech);
  data = searchContent(data, ['title', 'description', 'tech'], search);
  data = sortContent(data, sort);

  return paginateContentWithMeta(data, page, count);
}

/**
 * 단일 프로젝트 조회
 */
async function getProject(slug: string): Promise<Project | null> {
  const entries = contentReader.getEntries('projects');
  return entries.find(project => project.slug === slug) || null;
}

/**
 * MDX 콘텐츠 읽기
 */
async function getProjectContent(slug: string): Promise<string | null> {
  const project = await getProject(slug);
  if (!project || !project.content) return null;

  return project.content;
}

type ProjectsService = () => {
  getProjects: (search?: GetProjects['search']) => Promise<GetProjects['response']>;
  getProject: (params: GetProject['params']) => Promise<GetProject['response']>;
  getProjectContent: (params: GetProjectContent['params']) => Promise<GetProjectContent['response']>;
};

export const createProjectsService: ProjectsService = () => ({
  getProjects: async search => {
    const response = await getProjects(search);
    return response;
  },

  getProject: async params => {
    const response = await getProject(params.slug);
    return response;
  },

  getProjectContent: async params => {
    const response = await getProjectContent(params.slug);
    return response;
  },
});
