import type { GetTranslateContent, GetTranslatePost, GetTranslatePosts } from '@/entities/translate/types';

import { getTranslateContent, getTranslatePost, getTranslatePosts } from '@jinho-blog/mdx-handler';

type TranslateService = () => {
  getTranslatePosts: (search?: GetTranslatePosts['search']) => Promise<GetTranslatePosts['response']>;
  getTranslatePost: (params: GetTranslatePost['params']) => Promise<GetTranslatePost['response']>;
  getTranslateContent(params: GetTranslateContent['params']): Promise<GetTranslateContent['response']>;
};

export const createTranslateService: TranslateService = () => ({
  getTranslatePosts: async search => {
    const response = await getTranslatePosts(search);
    return response;
  },

  getTranslatePost: async params => {
    const response = await getTranslatePost(params.slug);
    return response;
  },

  getTranslateContent: async params => {
    const response = await getTranslateContent(params.slug);
    return response;
  },
});
