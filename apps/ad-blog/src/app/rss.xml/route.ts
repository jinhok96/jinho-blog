import { getPosts } from '@/entities/post';

import { buildRssFeed } from './feed';

/** 정적 export(`output: 'export'`)는 Route Handler를 빌드 시 out/rss.xml 파일로 생성하도록 명시해야 함 */
export const dynamic = 'force-static';

/**
 * RSS 2.0 피드 (/rss.xml)
 * - 요청 정보를 읽지 않음 (정적 export 제약)
 */
export function GET(): Response {
  return new Response(buildRssFeed(getPosts()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
