import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { frontmatterDate, frontmatterSchema } from './schema.js';

const valid = { title: '제목', description: '설명' };

describe('frontmatterDate', () => {
  it('Date(YAML 날짜) → ISO 문자열', () => {
    expect(frontmatterDate.parse(new Date('2024-01-01'))).toBe('2024-01-01T00:00:00.000Z');
  });

  it('날짜 문자열 → ISO 문자열', () => {
    expect(frontmatterDate.parse('2024-01-01')).toBe('2024-01-01T00:00:00.000Z');
    expect(frontmatterDate.parse('2024-01-01T09:00:00+09:00')).toBe('2024-01-01T00:00:00.000Z');
  });

  it('유효하지 않은 날짜 → 실패', () => {
    expect(frontmatterDate.safeParse('not-a-date').success).toBe(false);
  });
});

describe('frontmatterSchema', () => {
  it('필수 필드만 있으면 통과', () => {
    expect(frontmatterSchema.parse(valid)).toEqual(valid);
  });

  it('선택 필드(thumbnail, createdAt, updatedAt) 허용', () => {
    const result = frontmatterSchema.parse({
      ...valid,
      thumbnail: './images/a.webp',
      createdAt: new Date('2024-01-01'),
      updatedAt: '2024-02-01',
    });

    expect(result).toEqual({
      ...valid,
      thumbnail: './images/a.webp',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
    });
  });

  it.each(['title', 'description'] as const)('%s 누락 → 실패', field => {
    const { [field]: _omitted, ...rest } = valid;
    const result = frontmatterSchema.safeParse(rest);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual([field]);
  });

  it.each(['', '   '])('title이 빈 문자열(%j) → 실패', title => {
    expect(frontmatterSchema.safeParse({ ...valid, title }).success).toBe(false);
  });

  it('문자열이 아닌 title → 실패', () => {
    expect(frontmatterSchema.safeParse({ ...valid, title: 123 }).success).toBe(false);
  });

  it('정의되지 않은 키 → 실패 (strict)', () => {
    const result = frontmatterSchema.safeParse({ ...valid, catgory: 'frontend' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].code).toBe('unrecognized_keys');
  });

  it('extend 후에도 strict 유지', () => {
    const schema = frontmatterSchema.extend({ category: z.enum(['a', 'b']) });

    expect(schema.safeParse({ ...valid, category: 'a' }).success).toBe(true);
    expect(schema.safeParse({ ...valid, category: 'a', extra: true }).success).toBe(false);
  });
});
