import type { MetadataRoute } from 'next';

import { getBlogPosts, getLibraries, getProjects } from '@jinho-blog/mdx-handler';

import { SITE_URL } from '@/core/config';

async function fetchAllContent() {
  const [blogData, projectsData, librariesData] = await Promise.all([
    getBlogPosts({ count: 1000 }),
    getProjects({ count: 1000 }),
    getLibraries({ count: 1000 }),
  ]);

  return {
    blogPosts: blogData.items,
    projects: projectsData.items,
    libraries: librariesData.items,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/libraries`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  const { blogPosts, projects, libraries } = await fetchAllContent();

  // 동적 블로그 포스트
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${SITE_URL}${post.path}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 동적 프로젝트
  const projectPages: MetadataRoute.Sitemap = projects.map(project => ({
    url: `${SITE_URL}${project.path}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // 동적 라이브러리
  const libraryPages: MetadataRoute.Sitemap = libraries.map(lib => ({
    url: `${SITE_URL}${lib.path}`,
    lastModified: new Date(lib.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // 모든 페이지 결합
  return [...staticPages, ...blogPages, ...projectPages, ...libraryPages];
}
