import { defineCollection, defineContentConfig } from '@jinho-blog/mdx-handler';

import { pageSchema, postSchema } from './schemas';

/**
 * 콘텐츠 컬렉션 설정
 * - 경로는 앱 루트(apps/ad-blog) 기준
 * - 레지스트리는 public 밖에 생성: 정적 export 시 MDX 원문 JSON이 배포되지 않도록 함
 * - 날짜는 frontmatter만 사용: 얕은 클론으로 빌드하는 정적 호스트에서 Git 날짜가 최신 커밋 날짜로
 *   일괄 바뀌어 sitemap lastmod를 신뢰할 수 없게 되는 문제 방지
 */
export const contentConfig = defineContentConfig({
  contentDir: 'content',
  staticDir: 'public/_static',
  staticUrl: '/_static',
  registryFile: '.content/registry.json',
  gitDates: false,
  collections: {
    posts: defineCollection({ route: '/posts', schema: postSchema, generateThumbnail: true }),
    // 루트 경로 페이지: content/pages/about.mdx → /about
    pages: defineCollection({ route: '', schema: pageSchema }),
  },
});
