import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/core/seo';

import { getPages } from '@/entities/page';
import { getCategorySummaries, getPosts } from '@/entities/post';

/** 정적 export(`output: 'export'`)는 빌드 시 sitemap.xml 파일로 생성하도록 명시해야 함 */
export const dynamic = 'force-static';

type Dated = { updatedAt: string };

/**
 * 사이트 경로 → sitemap `<loc>` 값
 * - 한글 등 비ASCII slug는 퍼센트 인코딩 (sitemap 프로토콜은 이스케이프된 URL 요구)
 * - Next.js가 `<loc>`를 이스케이프하지 않으므로 XML 특수문자 `&` 직접 처리
 */
function toLoc(path: string): string {
  return encodeURI(absoluteUrl(path)).replace(/&/g, '&amp;');
}

/**
 * 가장 최근 수정일
 * - 목록 페이지 lastmod를 소속 콘텐츠 기준으로 고정 (빌드마다 바뀌면 크롤러가 lastmod를 신뢰하지 않음)
 * - 항목이 없으면 undefined → lastmod 생략
 */
function latestModified(items: Dated[]): Date | undefined {
  const times = items.map(({ updatedAt }) => new Date(updatedAt).getTime());
  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

/**
 * sitemap.xml
 * - 홈, 글, 카테고리 첫 페이지, 정적 페이지 (페이지네이션 `/page/n`은 제외)
 * - 초안은 getPosts()에서 제외됨
 * - changefreq·priority는 Google이 무시하므로 생략
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();

  return [
    { url: toLoc('/'), lastModified: latestModified(posts) },
    ...posts.map(post => ({ url: toLoc(post.path), lastModified: new Date(post.updatedAt) })),
    // 글이 있는 카테고리만 (빈 목록 페이지는 색인 가치 없음)
    ...getCategorySummaries().map(({ category }) => ({
      url: toLoc(`/categories/${category}`),
      lastModified: latestModified(posts.filter(post => post.category === category)),
    })),
    ...getPages().map(page => ({ url: toLoc(page.path), lastModified: new Date(page.updatedAt) })),
  ];
}
