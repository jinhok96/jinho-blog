import { describe, expect, it } from 'vitest';

import { blogSchema, librarySchema, projectSchema, translateSchema } from './schemas';

const base = { title: '제목', description: '설명' };

// 특정 필드를 제외한 frontmatter
function omitField(data: Record<string, unknown>, field: string): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([key]) => key !== field));
}

const validBlog = { ...base, category: 'frontend' };
const validProject = {
  ...base,
  category: 'personal',
  tech: ['nextjs', 'typescript'],
  period: '2024.01 - 2024.06',
  members: '1명',
  links: ['https://jinho-blog.com'],
};
const validLibrary = { ...base, category: 'react', tech: ['react'] };
const validTranslate = { ...base, category: 'react', sourceUrl: 'https://react.dev/blog/react-compiler' };

// ---------------------------------------------------------------------------
// 공통 (frontmatterSchema 확장)
// ---------------------------------------------------------------------------
describe.each([
  ['blogSchema', blogSchema, validBlog],
  ['projectSchema', projectSchema, validProject],
  ['librarySchema', librarySchema, validLibrary],
  ['translateSchema', translateSchema, validTranslate],
] as const)('%s 공통', (_name, schema, valid) => {
  it('유효한 frontmatter → 통과', () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it('정의되지 않은 키 → 실패 (strict)', () => {
    const result = schema.safeParse({ ...valid, unknownKey: 'value' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].code).toBe('unrecognized_keys');
  });

  it('유효하지 않은 category → 실패', () => {
    const result = schema.safeParse({ ...valid, category: 'invalid-category' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['category']);
  });

  it('category 누락 → 실패', () => {
    expect(schema.safeParse(omitField(valid, 'category')).success).toBe(false);
  });

  it('createdAt 날짜 → ISO 문자열로 정규화', () => {
    const result = schema.parse({ ...valid, createdAt: new Date('2024-01-01') });

    expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
  });
});

// ---------------------------------------------------------------------------
// blogSchema
// ---------------------------------------------------------------------------
describe('blogSchema', () => {
  it('thumbnail 선택 필드 허용', () => {
    expect(blogSchema.safeParse({ ...validBlog, thumbnail: './images/a.webp' }).success).toBe(true);
  });

  it('기술 스택 카테고리 → 실패 (블로그 카테고리만 허용)', () => {
    expect(blogSchema.safeParse({ ...validBlog, category: 'react' }).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// projectSchema
// ---------------------------------------------------------------------------
describe('projectSchema', () => {
  it('links 없이 통과 (선택 필드)', () => {
    expect(projectSchema.safeParse(omitField(validProject, 'links')).success).toBe(true);
  });

  it('빈 tech 배열 → 실패', () => {
    const result = projectSchema.safeParse({ ...validProject, tech: [] });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['tech']);
  });

  it('유효하지 않은 기술 스택 → 실패', () => {
    const result = projectSchema.safeParse({ ...validProject, tech: ['react', 'unknown-tech'] });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['tech', 1]);
  });

  it('tech 누락 → 실패', () => {
    expect(projectSchema.safeParse(omitField(validProject, 'tech')).success).toBe(false);
  });

  it.each(['period', 'members'] as const)('%s 누락 → 실패', field => {
    const result = projectSchema.safeParse(omitField(validProject, field));

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual([field]);
  });

  it.each(['period', 'members'] as const)('%s 공백 문자열 → 실패', field => {
    expect(projectSchema.safeParse({ ...validProject, [field]: '   ' }).success).toBe(false);
  });

  it('유효하지 않은 links URL → 실패', () => {
    const result = projectSchema.safeParse({ ...validProject, links: ['not-a-url'] });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['links', 0]);
  });
});

// ---------------------------------------------------------------------------
// librarySchema
// ---------------------------------------------------------------------------
describe('librarySchema', () => {
  it('블로그 카테고리 → 실패 (기술 스택만 허용)', () => {
    expect(librarySchema.safeParse({ ...validLibrary, category: 'frontend' }).success).toBe(false);
  });

  it('빈 tech 배열 → 실패', () => {
    const result = librarySchema.safeParse({ ...validLibrary, tech: [] });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['tech']);
  });

  it('유효하지 않은 기술 스택 → 실패', () => {
    expect(librarySchema.safeParse({ ...validLibrary, tech: ['unknown-tech'] }).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// translateSchema
// ---------------------------------------------------------------------------
describe('translateSchema', () => {
  it('sourceUrl 누락 → 실패', () => {
    const result = translateSchema.safeParse(omitField(validTranslate, 'sourceUrl'));

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['sourceUrl']);
  });

  it('유효하지 않은 sourceUrl → 실패', () => {
    const result = translateSchema.safeParse({ ...validTranslate, sourceUrl: 'not-a-url' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['sourceUrl']);
  });
});
