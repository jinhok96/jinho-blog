import type { GetProjects } from '@/entities/projects/types';

import { routes } from '@jinho-blog/nextjs-routes';

import { http, type HttpClient } from '@/core/http';

const defaultHttpClient = http();

type ProjectsService = (httpClient?: typeof defaultHttpClient) => {
  getProjects: (params: GetProjects['Params']) => Promise<GetProjects['Response']>;
};

export const createProjectsService: ProjectsService = (httpClient: HttpClient = defaultHttpClient) => ({
  getProjects: async params => {
    const response = await httpClient.get<GetProjects['Response']>(
      routes({ pathname: '/api/projects', search: params })
    );
    return response;
  },
});
