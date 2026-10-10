import { describe, expect, expectTypeOf, it } from 'vitest';
import { z } from 'zod';

import { type CollectionEntry, defineCollection, defineContentConfig } from './define.js';
import { frontmatterSchema } from './schema.js';

describe('defineCollection / defineContentConfig', () => {
  it('입력을 그대로 반환', () => {
    const blog = defineCollection({ route: '/blog', schema: frontmatterSchema, generateThumbnail: true });
    const config = defineContentConfig({
      contentDir: 'content',
      staticDir: 'public/_static',
      staticUrl: '/_static',
      collections: { blog },
    });

    expect(config.collections.blog).toBe(blog);
  });

  it('CollectionEntry: 스키마 출력 + 생성 필드, generateThumbnail에 따라 thumbnail 필수 여부 결정', () => {
    const schema = frontmatterSchema.extend({ category: z.enum(['a', 'b']) });
    const withThumbnail = defineCollection({ route: '/a', schema, generateThumbnail: true });
    const withoutThumbnail = defineCollection({ route: '/b', schema });

    type WithThumbnail = CollectionEntry<typeof withThumbnail>;
    type WithoutThumbnail = CollectionEntry<typeof withoutThumbnail>;

    expectTypeOf<WithThumbnail['category']>().toEqualTypeOf<'a' | 'b'>();
    expectTypeOf<WithThumbnail['createdAt']>().toEqualTypeOf<string>();
    expectTypeOf<WithThumbnail['content']>().toEqualTypeOf<string>();
    expectTypeOf<WithThumbnail['thumbnail']>().toEqualTypeOf<string>();
    expectTypeOf<WithoutThumbnail['thumbnail']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<WithThumbnail['ogImage']>().toEqualTypeOf<string | undefined>();
  });
});
