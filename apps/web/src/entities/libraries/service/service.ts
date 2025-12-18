import type { GetLibraries, GetLibrary, GetLibraryContent } from '@/entities/libraries/types';

import { routes } from '@jinho-blog/nextjs-routes';

import { http, type HttpClient } from '@/core/http';

const defaultHttpClient = http();

type LibrariesService = (httpClient?: typeof defaultHttpClient) => {
  getLibraries: (search?: GetLibraries['search']) => Promise<GetLibraries['response']>;
  getLibrary: (params: GetLibrary['params']) => Promise<GetLibrary['response']>;
  getLibraryContent: (params: GetLibraryContent['params']) => Promise<GetLibraryContent['response']>;
};

export const createLibrariesService: LibrariesService = (httpClient: HttpClient = defaultHttpClient) => ({
  getLibraries: async search => {
    const response = await httpClient.get<GetLibraries['response']>(routes({ pathname: '/api/libraries', search }));
    return response;
  },

  getLibrary: async params => {
    const response = await httpClient.get<GetLibrary['response']>(
      routes({ pathname: '/api/libraries/[slug]', params }),
    );
    return response;
  },

  getLibraryContent: async params => {
    const response = await httpClient.get<GetLibraryContent['response']>(
      routes({ pathname: '/api/libraries/[slug]/content', params }),
    );
    return response;
  },
});
