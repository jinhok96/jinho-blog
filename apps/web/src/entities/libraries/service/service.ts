import type {
  GetLibraries,
  GetLibrary,
  GetLibraryContent,
  GetLibraryGroupsByCategory,
} from '@/entities/libraries/types';

import { getLibraries, getLibrary, getLibraryContent, getLibraryGroupsByCategory } from '@jinho-blog/mdx-handler';

type LibrariesService = () => {
  getLibraries: (search?: GetLibraries['search']) => Promise<GetLibraries['response']>;
  getLibraryGroupsByCategory: (
    search?: GetLibraryGroupsByCategory['search'],
  ) => Promise<GetLibraryGroupsByCategory['response']>;
  getLibrary: (params: GetLibrary['params']) => Promise<GetLibrary['response']>;
  getLibraryContent: (params: GetLibraryContent['params']) => Promise<GetLibraryContent['response']>;
};

export const createLibrariesService: LibrariesService = () => ({
  getLibraries: async search => {
    const response = await getLibraries(search);
    return response;
  },

  getLibraryGroupsByCategory: async search => {
    const response = await getLibraryGroupsByCategory(search);
    return response;
  },

  getLibrary: async params => {
    const response = await getLibrary(params.slug);
    return response;
  },

  getLibraryContent: async params => {
    const response = await getLibraryContent(params.slug);
    return response;
  },
});
