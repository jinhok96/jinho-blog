import type { Post } from '@/entities/post';

import { CATEGORY_MAP, SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME } from '@/core/config';
import { absoluteUrl, selectOgImage } from '@/core/seo';

/** 피드에 포함할 최근 변경 글 수 */
export const RSS_ITEM_LIMIT = 20;

export type FeedPost = Pick<
  Post,
  'title' | 'description' | 'path' | 'category' | 'updatedAt' | 'ogImage' | 'thumbnail'
>;

const XML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

/** XML 텍스트·속성 값 이스케이프 */
export function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, char => XML_ENTITIES[char]);
}

/** 사이트 경로 → 피드 링크 (absoluteUrl이 한글 slug 퍼센트 인코딩, canonical과 동일한 URL) */
function toFeedUrl(path: string): string {
  return absoluteUrl(path);
}

/** RFC 822 날짜 (RSS 2.0 pubDate·lastBuildDate 형식) */
function toRfc822(isoDate: string): string {
  return new Date(isoDate).toUTCString();
}

/**
 * 항목 대표 이미지 (Media RSS `media:content`)
 * - Pinterest RSS 자동 게시 등 이미지가 필요한 피드 소비자용, 글 OG 이미지와 같은 선택 규칙
 */
function buildMediaContent(post: FeedPost): string {
  const { url, width, height } = selectOgImage(post);
  const size = width && height ? ` width="${width}" height="${height}"` : '';

  return `      <media:content url="${escapeXml(absoluteUrl(url))}" medium="image"${size} />`;
}

/** 최근 변경 순 (updatedAt 내림차순, 같으면 입력 순서 유지: Array.prototype.sort는 안정 정렬) */
function byRecentChange(posts: FeedPost[]): FeedPost[] {
  return [...posts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function buildItem(post: FeedPost): string {
  const url = escapeXml(toFeedUrl(post.path));

  return [
    '    <item>',
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    `      <pubDate>${toRfc822(post.updatedAt)}</pubDate>`,
    `      <description>${escapeXml(post.description)}</description>`,
    `      <category>${escapeXml(CATEGORY_MAP[post.category].name)}</category>`,
    buildMediaContent(post),
    '    </item>',
  ].join('\n');
}

/**
 * RSS 2.0 피드 XML 생성
 * - 피드는 사이트의 최근 변경을 알림 (sitemap은 전체 URL): posts(공개 글, getPosts() 결과)를 최근 변경 순으로 정렬해
 *   앞에서 RSS_ITEM_LIMIT개만 포함 → 내용을 크게 고친 옛 글(updatedAt 갱신)도 sitemap보다 자주 받아 가는 피드에 다시 오름
 * - pubDate는 글의 마지막 의미 있는 수정 시각 (updatedAt, sitemap lastmod와 같은 값. updatedAt이 없는 글은 발행 시각)
 *   Google Search Central "Best practices for XML sitemaps and RSS/Atom feeds": RSS는 pubDate로 마지막 수정 시각을 알림
 * - lastBuildDate는 포함된 글의 최신 수정일 (빌드 시각을 쓰면 내용 변화 없이 매 빌드마다 바뀜), 글이 없으면 생략
 */
export function buildRssFeed(posts: FeedPost[]): string {
  const items = byRecentChange(posts).slice(0, RSS_ITEM_LIMIT);
  const latestUpdatedAt = items.reduce<string | undefined>(
    (latest, { updatedAt }) => (!latest || new Date(updatedAt) > new Date(latest) ? updatedAt : latest),
    undefined,
  );

  const channel = [
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${escapeXml(toFeedUrl('/'))}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    `    <language>${SITE_LANGUAGE}</language>`,
    `    <atom:link href="${escapeXml(toFeedUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />`,
    ...(latestUpdatedAt ? [`    <lastBuildDate>${toRfc822(latestUpdatedAt)}</lastBuildDate>`] : []),
    ...items.map(buildItem),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    ...channel,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
