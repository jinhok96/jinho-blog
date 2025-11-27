import type { BlogPost } from './types';

// Blog 파일들을 직접 import
import FirstPost, { metadata as firstPostMeta } from '@/views/blog/first-post';

const blogPosts: BlogPost[] = [
  {
    slug: 'first-post',
    title: firstPostMeta?.title || 'first-post',
    description: firstPostMeta?.description || '',
    date: firstPostMeta?.date || '',
    tags: firstPostMeta?.tags || [],
    Component: FirstPost,
  },
];

export async function getBlogPosts(): Promise<BlogPost[]> {
  // 날짜순 정렬 (최신순)
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return blogPosts.find(post => post.slug === slug) || null;
}
