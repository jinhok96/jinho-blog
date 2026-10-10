import { defineCollection, defineContentConfig } from '@jinho-blog/mdx-handler';

import { pageSchema, postSchema } from './schemas';

/**
 * 콘텐츠 컬렉션 설정
 * - 경로는 앱 루트(apps/ad-blog) 기준
 * - 레지스트리는 public 밖에 생성: 정적 export 시 MDX 원문 JSON이 배포되지 않도록 함
 */
export const contentConfig = defineContentConfig({
  contentDir: 'content',
  staticDir: 'public/_static',
  staticUrl: '/_static',
  registryFile: '.content/registry.json',
  github: { owner: 'jinhok96', repo: 'jinho-blog' },
  collections: {
    posts: defineCollection({ route: '/posts', schema: postSchema, generateThumbnail: true }),
    // 루트 경로 페이지: content/pages/about.mdx → /about
    pages: defineCollection({ route: '', schema: pageSchema }),
  },
});
