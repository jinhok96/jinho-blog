import { defineCollection, defineContentConfig } from '@jinho-blog/mdx-handler';

import { blogSchema, librarySchema, projectSchema, translateSchema } from './schemas';

// 빌드 스크립트(tsx)에서도 import되므로 `@/` 별칭 대신 패키지·상대 경로만 사용

/**
 * 콘텐츠 컬렉션 설정
 * - 경로는 앱 루트(apps/web) 기준
 */
export const contentConfig = defineContentConfig({
  contentDir: '../../content/mdx',
  staticDir: 'public/_static',
  staticUrl: '/_static',
  github: { owner: 'jinhok96', repo: 'jinho-blog' },
  collections: {
    blog: defineCollection({ route: '/blog', schema: blogSchema, generateThumbnail: true }),
    projects: defineCollection({ route: '/projects', schema: projectSchema }),
    libraries: defineCollection({ route: '/libraries', schema: librarySchema }),
    translate: defineCollection({
      route: '/translate',
      schema: translateSchema,
      generateThumbnail: true,
      copyMedia: false,
    }),
  },
});
