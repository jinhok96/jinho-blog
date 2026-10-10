import type { Post } from '@/entities/post';

import { CATEGORY_MAP, SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME } from '@/core/config';
import { absoluteUrl } from '@/core/seo';

/** 피드에 포함할 최신 글 수 */
export const RSS_ITEM_LIMIT = 20;

export type FeedPost = Pick<Post, 'title' | 'description' | 'path' | 'category' | 'createdAt' | 'updatedAt'>;

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

/** 사이트 경로 → 피드 링크 (한글 slug 퍼센트 인코딩) */
function toFeedUrl(path: string): string {
  return encodeURI(absoluteUrl(path));
}

/** RFC 822 날짜 (RSS 2.0 pubDate·lastBuildDate 형식) */
function toRfc822(isoDate: string): string {
  return new Date(isoDate).toUTCString();
}

function buildItem(post: FeedPost): string {
  const url = escapeXml(toFeedUrl(post.path));

  return [
    '    <item>',
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    `      <pubDate>${toRfc822(post.createdAt)}</pubDate>`,
    `      <description>${escapeXml(post.description)}</description>`,
    `      <category>${escapeXml(CATEGORY_MAP[post.category].name)}</category>`,
    '    </item>',
  ].join('\n');
}

/**
 * RSS 2.0 피드 XML 생성
 * - posts는 최신순 정렬된 공개 글 (getPosts() 결과), 앞에서 RSS_ITEM_LIMIT개만 포함
 * - lastBuildDate는 포함된 글의 최신 수정일 (빌드 시각을 쓰면 내용 변화 없이 매 빌드마다 바뀜), 글이 없으면 생략
 */
export function buildRssFeed(posts: FeedPost[]): string {
  const items = posts.slice(0, RSS_ITEM_LIMIT);
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
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    ...channel,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
