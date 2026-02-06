import type { GetBlogContent, GetBlogPost, GetBlogPosts } from '@/entities/blog/types';

import { getBlogContent, getBlogPost, getBlogPosts } from '@jinho-blog/mdx-handler';

type BlogService = () => {
  getBlogPosts: (search?: GetBlogPosts['search']) => Promise<GetBlogPosts['response']>;
  getBlogPost: (params: GetBlogPost['params']) => Promise<GetBlogPost['response']>;
  getBlogContent(params: GetBlogContent['params']): Promise<GetBlogContent['response']>;
};

export const createBlogService: BlogService = () => ({
  getBlogPosts: async search => {
    const response = await getBlogPosts(search);
    return response;
  },

  getBlogPost: async params => {
    const response = await getBlogPost(params.slug);
    return response;
  },

  getBlogContent: async params => {
    const response = await getBlogContent(params.slug);
    return response;
  },
});
