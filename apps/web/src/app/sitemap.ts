import type { MetadataRoute } from 'next';

import { getBlogPosts, getLibraries, getProjects, getTranslatePosts } from '@jinho-blog/mdx-handler';

import { SITE_URL } from '@/core/config';

type SitemapContent = {
  path: string;
  updatedAt: string;
};

// 전체 콘텐츠를 한 번에 조회하기 위한 상한값
const MAX_COUNT = 1000;

async function fetchAllContent() {
  const [blogData, projectsData, librariesData, translateData] = await Promise.all([
    getBlogPosts({ count: MAX_COUNT }),
    getProjects({ count: MAX_COUNT }),
    getLibraries({ count: MAX_COUNT }),
    getTranslatePosts({ count: MAX_COUNT }),
  ]);

  return {
    blogPosts: blogData.items,
    projects: projectsData.items,
    libraries: librariesData.items,
    translatePosts: translateData.items,
  };
}

/**
 * 유효한 날짜만 Date로 변환 (파싱 실패 시 fallback)
 */
function toDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

/**
 * 목록 페이지의 lastmod: 하위 콘텐츠 중 가장 최근 수정일
 * 배포할 때마다 lastmod가 갱신되어 구글이 lastmod 자체를 무시하는 것을 방지
 */
function getLatestDate(items: SitemapContent[], fallback: Date): Date {
  const timestamps = items.map(item => toDate(item.updatedAt, fallback).getTime());
  if (timestamps.length === 0) return fallback;

  return new Date(Math.max(...timestamps));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { blogPosts, projects, libraries, translatePosts } = await fetchAllContent();

  const buildDate = new Date();
  const allContents = [...blogPosts, ...projects, ...libraries, ...translatePosts];

  const toEntry = (item: SitemapContent): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${item.path}`,
    lastModified: toDate(item.updatedAt, buildDate),
  });

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: getLatestDate(allContents, buildDate),
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: getLatestDate(blogPosts, buildDate),
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: getLatestDate(projects, buildDate),
    },
    {
      url: `${SITE_URL}/libraries`,
      lastModified: getLatestDate(libraries, buildDate),
    },
    {
      url: `${SITE_URL}/translate`,
      lastModified: getLatestDate(translatePosts, buildDate),
    },
  ];

  // 모든 페이지 결합
  return [
    ...staticPages,
    ...blogPosts.map(toEntry),
    ...projects.map(toEntry),
    ...libraries.map(toEntry),
    ...translatePosts.map(toEntry),
  ];
}
