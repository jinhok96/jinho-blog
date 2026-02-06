import type { GetProject, GetProjectContent, GetProjects } from '@/entities/projects/types';

import { routes } from '@jinho-blog/nextjs-routes';

import { http, type HttpClient } from '@/core/http';
import { getProjects } from '@jinho-blog/mdx-handler';

const defaultHttpClient = http();

type ProjectsService = (httpClient?: typeof defaultHttpClient) => {
  getProjects: (search?: GetProjects['search']) => Promise<GetProjects['response']>;
  getProject: (params: GetProject['params']) => Promise<GetProject['response']>;
  getProjectContent: (params: GetProjectContent['params']) => Promise<GetProjectContent['response']>;
};

export const createProjectsService: ProjectsService = (httpClient: HttpClient = defaultHttpClient) => ({
  getProjects: async search => {
    const response = await getProjects(search);
    return response;
  },

  getProject: async params => {
    const response = await httpClient.get<GetProject['response']>(routes({ pathname: '/api/projects/[slug]', params }));
    return response;
  },

  getProjectContent: async params => {
    const response = await httpClient.get<GetProjectContent['response']>(
      routes({ pathname: '/api/projects/[slug]/content', params }),
    );
    return response;
  },
});
