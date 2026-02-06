import type { GetProject, GetProjectContent, GetProjects } from '@/entities/projects/types';

import { getProject, getProjectContent, getProjects } from '@jinho-blog/mdx-handler';

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
    console.log('params', params);
    const response = await getProject(params.slug);
    return response;
  },

  getProjectContent: async params => {
    const response = await getProjectContent(params.slug);
    return response;
  },
});
