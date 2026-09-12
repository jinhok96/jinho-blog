import type { MetadataRoute } from 'next';

import { getBlogPosts, getLibraries, getProjects, getTranslatePosts } from '@jinho-blog/mdx-handler';

import { SITE_URL } from '@/core/config';

type ContentItem = {
  path: string;
  createdAt: string;
  updatedAt?: string;
};

async function fetchAllContent() {
  const [blogData, projectsData, librariesData, translateData] = await Promise.all([
    getBlogPosts({ count: 1000 }),
    getProjects({ count: 1000 }),
    getLibraries({ count: 1000 }),
    getTranslatePosts({ count: 1000 }),
  ]);

  return {
    blogPosts: blogData.items,
    projects: projectsData.items,
    libraries: librariesData.items,
    translatePosts: translateData.items,
  };
}

function toLastModified(item: ContentItem): Date {
  return new Date(item.updatedAt || item.createdAt);
}

/**
 * 목록 페이지의 lastModified를 소속 콘텐츠의 최신 수정 시각으로 계산합니다.
 * 빌드할 때마다 `new Date()`로 갱신되면 크롤러가 lastmod 신호를 신뢰하지 않습니다.
 */
function latestModified(items: ContentItem[]): Date {
  if (!items.length) return new Date(0);
  return items.reduce<Date>((latest, item) => {
    const current = toLastModified(item);
    return current > latest ? current : latest;
  }, new Date(0));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { blogPosts, projects, libraries, translatePosts } = await fetchAllContent();

  const allItems = [...blogPosts, ...projects, ...libraries, ...translatePosts];

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: latestModified(allItems),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestModified(blogPosts),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: latestModified(projects),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/libraries`,
      lastModified: latestModified(libraries),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/translate`,
      lastModified: latestModified(translatePosts),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 동적 블로그 포스트
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${SITE_URL}${post.path}`,
    lastModified: toLastModified(post),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 동적 프로젝트
  const projectPages: MetadataRoute.Sitemap = projects.map(project => ({
    url: `${SITE_URL}${project.path}`,
    lastModified: toLastModified(project),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 동적 라이브러리
  const libraryPages: MetadataRoute.Sitemap = libraries.map(lib => ({
    url: `${SITE_URL}${lib.path}`,
    lastModified: toLastModified(lib),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 동적 번역 포스트
  const translatePages: MetadataRoute.Sitemap = translatePosts.map(post => ({
    url: `${SITE_URL}${post.path}`,
    lastModified: toLastModified(post),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // 모든 페이지 결합
  return [...staticPages, ...blogPages, ...projectPages, ...libraryPages, ...translatePages];
}
