import type { GetBlogContent, GetBlogPost, GetBlogPosts } from '@/entities/blog/types';

import { routes } from '@jinho-blog/nextjs-routes';

import { http, type HttpClient } from '@/core/http';

const defaultHttpClient = http();

type BlogService = (httpClient?: typeof defaultHttpClient) => {
  getBlogPosts: (search?: GetBlogPosts['search']) => Promise<GetBlogPosts['response']>;
  getBlogPost: (params: GetBlogPost['params']) => Promise<GetBlogPost['response']>;
  getBlogContent(params: GetBlogContent['params']): Promise<GetBlogContent['response']>;
};

export const createBlogService: BlogService = (httpClient: HttpClient = defaultHttpClient) => ({
  getBlogPosts: async search => {
    const response = await httpClient.get<GetBlogPosts['response']>(routes({ pathname: '/api/blog', search }));
    return response;
  },

  getBlogPost: async params => {
    const response = await httpClient.get<GetBlogPost['response']>(routes({ pathname: '/api/blog/[slug]', params }));
    return response;
  },

  getBlogContent: async params => {
    const response = await httpClient.get<GetBlogContent['response']>(
      routes({ pathname: '/api/blog/[slug]/content', params }),
    );
    return response;
  },
});
