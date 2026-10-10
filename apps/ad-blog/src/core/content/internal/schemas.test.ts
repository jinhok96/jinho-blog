import { describe, expect, it } from 'vitest';

import { pageSchema, postSchema } from './schemas';

const validPost = {
  title: '제목',
  description: '설명',
  category: 'general',
  createdAt: new Date('2026-01-01'),
};

describe('postSchema', () => {
  it('필수 필드만 있으면 통과하고 기본값 적용 (tags: [], draft: false)', () => {
    expect(postSchema.parse(validPost)).toEqual({
      title: '제목',
      description: '설명',
      category: 'general',
      createdAt: '2026-01-01T00:00:00.000Z',
      tags: [],
      draft: false,
    });
  });

  it('선택 필드 허용 (tags, updatedAt, thumbnail, draft)', () => {
    const result = postSchema.parse({
      ...validPost,
      tags: ['태그'],
      updatedAt: '2026-02-01',
      thumbnail: './images/cover.webp',
      draft: true,
    });

    expect(result).toMatchObject({
      tags: ['태그'],
      updatedAt: '2026-02-01T00:00:00.000Z',
      thumbnail: './images/cover.webp',
      draft: true,
    });
  });

  it('createdAt 누락 → 실패 (발행일 명시 필수)', () => {
    const result = postSchema.safeParse({ ...validPost, createdAt: undefined });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['createdAt']);
  });

  it('정의되지 않은 카테고리 → 실패', () => {
    const result = postSchema.safeParse({ ...validPost, category: 'unknown' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['category']);
  });

  it('빈 태그 → 실패', () => {
    expect(postSchema.safeParse({ ...validPost, tags: [' '] }).success).toBe(false);
  });

  it('정의되지 않은 키 → 실패 (strict)', () => {
    const result = postSchema.safeParse({ ...validPost, tag: ['오타'] });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].code).toBe('unrecognized_keys');
  });
  it('수정일이 발행일보다 앞서면 실패, 같거나 이후면 통과', () => {
    const before = postSchema.safeParse({ ...validPost, updatedAt: '2025-12-31' });

    expect(before.success).toBe(false);
    expect(before.error?.issues[0].path).toEqual(['updatedAt']);
    expect(postSchema.safeParse({ ...validPost, updatedAt: '2026-01-01' }).success).toBe(true);
  });
});

describe('pageSchema', () => {
  const validPage = { title: '소개', description: '블로그 소개', createdAt: '2026-01-01' };

  it('제목·설명·발행일이 있으면 통과', () => {
    expect(pageSchema.safeParse(validPage).success).toBe(true);
  });

  it('발행일 누락 → 실패 (빌드 시각이 날짜로 쓰이지 않도록)', () => {
    const result = pageSchema.safeParse({ ...validPage, createdAt: undefined });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['createdAt']);
  });

  it('수정일이 발행일보다 앞서면 실패', () => {
    expect(pageSchema.safeParse({ ...validPage, updatedAt: '2025-01-01' }).success).toBe(false);
  });

  it('정의되지 않은 키 → 실패 (strict)', () => {
    expect(pageSchema.safeParse({ ...validPage, category: 'general' }).success).toBe(false);
  });
});
