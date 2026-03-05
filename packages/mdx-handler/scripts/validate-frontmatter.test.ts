import { describe, expect, it } from 'vitest';

import { validateFrontmatter } from './validate-frontmatter.js';

// ---------------------------------------------------------------------------
// 공통 헬퍼
// ---------------------------------------------------------------------------
const validBlog = {
  title: '테스트 포스트',
  description: '설명입니다.',
  category: 'frontend',
};

const validProject = {
  title: '테스트 프로젝트',
  description: '설명입니다.',
  category: 'personal',
  tech: ['react', 'typescript'],
  period: '2024.01 - 2024.06',
  members: '1인',
};

const validLibrary = {
  title: '테스트 라이브러리',
  description: '설명입니다.',
  category: 'react',
  tech: ['react', 'typescript'],
};

// ---------------------------------------------------------------------------
// blog
// ---------------------------------------------------------------------------
describe('validateFrontmatter - blog', () => {
  it('유효한 frontmatter → { valid: true, errors: [] }', () => {
    const result = validateFrontmatter(validBlog, 'blog');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  describe('title 검증', () => {
    it('title 없음(undefined) → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validBlog, title: undefined }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'title', message: '필수 필드입니다.' });
    });

    it('title이 null → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validBlog, title: null }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'title', message: '필수 필드입니다.' });
    });

    it('title이 문자열이 아님(number) → 타입 에러', () => {
      const result = validateFrontmatter({ ...validBlog, title: 123 }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'title', message: '문자열이어야 합니다. (받은 타입: number)' });
    });

    it('title이 빈 문자열 → 빈 문자열 에러', () => {
      const result = validateFrontmatter({ ...validBlog, title: '' }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'title', message: '빈 문자열은 허용되지 않습니다.' });
    });

    it('title이 공백만 있는 문자열 → 빈 문자열 에러', () => {
      const result = validateFrontmatter({ ...validBlog, title: '   ' }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'title', message: '빈 문자열은 허용되지 않습니다.' });
    });
  });

  describe('description 검증', () => {
    it('description 없음(undefined) → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validBlog, description: undefined }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'description', message: '필수 필드입니다.' });
    });

    it('description이 null → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validBlog, description: null }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'description', message: '필수 필드입니다.' });
    });

    it('description이 문자열이 아님(boolean) → 타입 에러', () => {
      const result = validateFrontmatter({ ...validBlog, description: true }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'description', message: '문자열이어야 합니다. (받은 타입: boolean)' });
    });

    it('description이 빈 문자열 → 빈 문자열 에러', () => {
      const result = validateFrontmatter({ ...validBlog, description: '' }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'description', message: '빈 문자열은 허용되지 않습니다.' });
    });
  });

  describe('category 검증', () => {
    it('category 없음(undefined) → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validBlog, category: undefined }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'category', message: '필수 필드입니다.' });
    });

    it('category가 유효하지 않은 값 → enum 에러', () => {
      const result = validateFrontmatter({ ...validBlog, category: 'invalid-category' }, 'blog');
      expect(result.valid).toBe(false);
      expect(result.errors.find(e => e.field === 'category')?.message).toContain('유효하지 않은 값입니다.');
    });

    it('유효한 blog category 전체 통과', () => {
      const categories = ['frontend', 'algorithm', 'cs', 'uiux', 'review'];
      for (const category of categories) {
        const result = validateFrontmatter({ ...validBlog, category }, 'blog');
        expect(result.valid).toBe(true);
      }
    });
  });

  it('여러 필드 동시에 누락 → 여러 에러 반환', () => {
    const result = validateFrontmatter({}, 'blog');
    expect(result.valid).toBe(false);
    expect(result.errors.map(e => e.field)).toEqual(expect.arrayContaining(['title', 'description', 'category']));
  });
});

// ---------------------------------------------------------------------------
// projects
// ---------------------------------------------------------------------------
describe('validateFrontmatter - projects', () => {
  it('유효한 frontmatter → { valid: true, errors: [] }', () => {
    const result = validateFrontmatter(validProject, 'projects');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  describe('category 검증', () => {
    it('유효하지 않은 category → enum 에러', () => {
      const result = validateFrontmatter({ ...validProject, category: 'invalid' }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors.find(e => e.field === 'category')?.message).toContain('유효하지 않은 값입니다.');
    });

    it('유효한 project category 전체 통과', () => {
      const categories = ['tripmoney', 'personal'];
      for (const category of categories) {
        const result = validateFrontmatter({ ...validProject, category }, 'projects');
        expect(result.valid).toBe(true);
      }
    });
  });

  describe('tech 검증', () => {
    it('tech 없음(undefined) → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validProject, tech: undefined }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'tech', message: '필수 필드입니다.' });
    });

    it('tech가 null → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validProject, tech: null }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'tech', message: '필수 필드입니다.' });
    });

    it('tech가 배열이 아님(string) → 타입 에러', () => {
      const result = validateFrontmatter({ ...validProject, tech: 'react' }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'tech', message: '배열이어야 합니다.' });
    });

    it('tech가 빈 배열 → 빈 배열 에러', () => {
      const result = validateFrontmatter({ ...validProject, tech: [] }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'tech', message: '빈 배열은 허용되지 않습니다.' });
    });

    it('tech에 유효하지 않은 스택 포함 → 유효하지 않은 기술 스택 에러', () => {
      const result = validateFrontmatter({ ...validProject, tech: ['react', 'invalid-stack'] }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors.find(e => e.field === 'tech')?.message).toContain('invalid-stack');
    });
  });

  describe('period 검증', () => {
    it('period 없음(undefined) → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validProject, period: undefined }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'period', message: '필수 필드입니다.' });
    });

    it('period가 빈 문자열 → 빈 문자열 에러', () => {
      const result = validateFrontmatter({ ...validProject, period: '' }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'period', message: '빈 문자열은 허용되지 않습니다.' });
    });
  });

  describe('members 검증', () => {
    it('members 없음(undefined) → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validProject, members: undefined }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'members', message: '필수 필드입니다.' });
    });

    it('members가 빈 문자열 → 빈 문자열 에러', () => {
      const result = validateFrontmatter({ ...validProject, members: '' }, 'projects');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'members', message: '빈 문자열은 허용되지 않습니다.' });
    });
  });

  it('여러 필드 동시에 누락 → 여러 에러 반환', () => {
    const result = validateFrontmatter({}, 'projects');
    expect(result.valid).toBe(false);
    const fields = result.errors.map(e => e.field);
    expect(fields).toEqual(expect.arrayContaining(['title', 'description', 'category', 'tech', 'period', 'members']));
  });
});

// ---------------------------------------------------------------------------
// libraries
// ---------------------------------------------------------------------------
describe('validateFrontmatter - libraries', () => {
  it('유효한 frontmatter → { valid: true, errors: [] }', () => {
    const result = validateFrontmatter(validLibrary, 'libraries');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  describe('category 검증 (LibraryCategory = TechStack)', () => {
    it('유효하지 않은 category → enum 에러', () => {
      const result = validateFrontmatter({ ...validLibrary, category: 'invalid-lib' }, 'libraries');
      expect(result.valid).toBe(false);
      expect(result.errors.find(e => e.field === 'category')?.message).toContain('유효하지 않은 값입니다.');
    });

    it('category가 null → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validLibrary, category: null }, 'libraries');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'category', message: '필수 필드입니다.' });
    });

    it('유효한 TechStack 값 → 통과', () => {
      const result = validateFrontmatter({ ...validLibrary, category: 'nextjs' }, 'libraries');
      expect(result.valid).toBe(true);
    });
  });

  describe('tech 검증', () => {
    it('tech 없음(undefined) → 필수 필드 에러', () => {
      const result = validateFrontmatter({ ...validLibrary, tech: undefined }, 'libraries');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'tech', message: '필수 필드입니다.' });
    });

    it('tech가 배열이 아님(number) → 타입 에러', () => {
      const result = validateFrontmatter({ ...validLibrary, tech: 42 }, 'libraries');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'tech', message: '배열이어야 합니다.' });
    });

    it('tech가 빈 배열 → 빈 배열 에러', () => {
      const result = validateFrontmatter({ ...validLibrary, tech: [] }, 'libraries');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual({ field: 'tech', message: '빈 배열은 허용되지 않습니다.' });
    });

    it('tech에 유효하지 않은 스택 여러 개 → 에러 메시지에 모두 포함', () => {
      const result = validateFrontmatter({ ...validLibrary, tech: ['bad1', 'bad2'] }, 'libraries');
      expect(result.valid).toBe(false);
      const techError = result.errors.find(e => e.field === 'tech');
      expect(techError?.message).toContain('bad1');
      expect(techError?.message).toContain('bad2');
    });
  });

  it('여러 필드 동시에 누락 → 여러 에러 반환', () => {
    const result = validateFrontmatter({}, 'libraries');
    expect(result.valid).toBe(false);
    const fields = result.errors.map(e => e.field);
    expect(fields).toEqual(expect.arrayContaining(['title', 'description', 'category', 'tech']));
  });
});
