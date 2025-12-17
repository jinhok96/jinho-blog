import type { GetLibraries } from '@/entities/libraries/types';

import { routes } from '@jinho-blog/nextjs-routes';

import { http, type HttpClient } from '@/core/http';

const defaultHttpClient = http();

type LibrariesService = (httpClient?: typeof defaultHttpClient) => {
  getLibraries: (params: GetLibraries['Params']) => Promise<GetLibraries['Response']>;
};

export const createLibrariesService: LibrariesService = (httpClient: HttpClient = defaultHttpClient) => ({
  getLibraries: async params => {
    const response = await httpClient.get<GetLibraries['Response']>(
      routes({ pathname: '/api/libraries', search: params })
    );
    return response;
  },
});
