import type { GetBlogPosts } from '@/entities/blog/types';

import { routes } from '@jinho-blog/nextjs-routes';

import { http, type HttpClient } from '@/core/http';

const defaultHttpClient = http();

type BlogService = (httpClient?: typeof defaultHttpClient) => {
  getBlogPosts: (params: GetBlogPosts['Params']) => Promise<GetBlogPosts['Response']>;
};

export const createBlogService: BlogService = (httpClient: HttpClient = defaultHttpClient) => ({
  getBlogPosts: async params => {
    const response = await httpClient.get<GetBlogPosts['Response']>(routes({ pathname: '/api/blog', search: params }));
    return response;
  },
});
