import { describe, expect, it } from 'vitest';

import { buildMdxContent, generateSlug, normalizeHeadings } from './mdx-builder.js';

// ---------------------------------------------------------------------------
// generateSlug
// ---------------------------------------------------------------------------
describe('generateSlug', () => {
  it('카테고리와 URL 마지막 세그먼트로 슬러그 생성', () => {
    expect(generateSlug('react', 'https://react.dev/blog/react-compiler')).toBe('react-react-compiler');
    expect(generateSlug('nextjs', 'https://nextjs.org/blog/next-15-1')).toBe('nextjs-next-15-1');
    expect(generateSlug('vercel', 'https://vercel.com/blog/ai-sdk-4')).toBe('vercel-ai-sdk-4');
  });

  it('URL 끝에 슬래시가 있어도 처리', () => {
    expect(generateSlug('react', 'https://react.dev/blog/react-compiler/')).toBe('react-react-compiler');
  });

  it('특수문자를 하이픈으로 변환', () => {
    expect(generateSlug('react', 'https://react.dev/blog/react_compiler_v2')).toBe('react-react-compiler-v2');
  });

  it('경로가 없으면 post 사용', () => {
    expect(generateSlug('react', 'https://react.dev/')).toBe('react-post');
  });
});

// ---------------------------------------------------------------------------
// buildMdxContent
// ---------------------------------------------------------------------------
describe('buildMdxContent', () => {
  const ccMeta = {
    title: 'React 컴파일러 소개',
    description: 'React 컴파일러의 동작 방식과 활용법',
    category: 'react',
    sourceUrl: 'https://react.dev/blog/react-compiler',
    sourceName: 'React Blog',
    originalTitle: 'React Compiler',
    translatedBody: '## 개요\n\nReact 컴파일러는...',
    license: 'cc-by-4.0' as const,
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  };

  const arMeta = {
    ...ccMeta,
    sourceName: 'Next.js Blog',
    sourceUrl: 'https://nextjs.org/blog/next-15',
    originalTitle: 'Next.js 15',
    license: 'all-rights-reserved' as const,
    licenseUrl: undefined,
  };

  it('frontmatter가 올바르게 포함됨', () => {
    const result = buildMdxContent(ccMeta);
    expect(result).toContain('title: React 컴파일러 소개');
    expect(result).toContain('description: React 컴파일러의 동작 방식과 활용법');
    expect(result).toContain('category: react');
    expect(result).toContain('sourceUrl: https://react.dev/blog/react-compiler');
  });

  it('원문 링크 줄이 포함됨', () => {
    const result = buildMdxContent(ccMeta);
    expect(result).toContain('> 원문: [React Compiler](https://react.dev/blog/react-compiler) — React Blog');
  });

  it('번역 본문이 포함됨', () => {
    const result = buildMdxContent(ccMeta);
    expect(result).toContain('## 개요\n\nReact 컴파일러는...');
  });

  it('frontmatter → attribution → 본문 순서', () => {
    const result = buildMdxContent(ccMeta);
    const frontmatterEnd = result.indexOf('---\n\n');
    const originLine = result.indexOf('> 원문:');
    const body = result.indexOf('## 개요');
    expect(frontmatterEnd).toBeLessThan(originLine);
    expect(originLine).toBeLessThan(body);
  });

  it('createdAt 있으면 frontmatter에 포함', () => {
    const result = buildMdxContent({ ...ccMeta, createdAt: '2024-10-21' });
    expect(result).toContain('createdAt: 2024-10-21');
  });

  it('createdAt 없으면 frontmatter에 미포함', () => {
    const result = buildMdxContent(ccMeta);
    expect(result).not.toContain('createdAt:');
  });

  it('특수문자 포함 제목은 따옴표로 감쌈', () => {
    const result = buildMdxContent({ ...ccMeta, title: 'React: A Deep Dive' });
    expect(result).toContain('title: "React: A Deep Dive"');
  });

  it('대괄호 포함 설명은 따옴표로 감쌈', () => {
    const result = buildMdxContent({ ...ccMeta, description: 'Array [1, 2, 3]' });
    expect(result).toContain('description: "Array [1, 2, 3]"');
  });

  it('CC 소스 — 라이선스 표시와 번역 안내 포함', () => {
    const result = buildMdxContent(ccMeta);
    expect(result).toContain('CC-BY-4.0');
    expect(result).toContain('https://creativecommons.org/licenses/by/4.0/');
    expect(result).toContain('한국어로 번역한 2차 저작물');
  });

  it('All-rights-reserved 소스 — 요약 안내 포함', () => {
    const result = buildMdxContent(arMeta);
    expect(result).toContain('핵심 내용을 요약한 것');
    expect(result).toContain('저작권은 원문 저자에게 있으며');
    expect(result).not.toContain('creativecommons.org');
  });
});

// ---------------------------------------------------------------------------
// normalizeHeadings
// ---------------------------------------------------------------------------
describe('normalizeHeadings', () => {
  it('h1이 있으면 그대로 반환', () => {
    const input = '# 제목\n\n## 소제목\n\n본문';
    expect(normalizeHeadings(input)).toBe(input);
  });

  it('h1 없이 h2만 있으면 h1으로 올림', () => {
    const input = '## 소제목\n\n### 세부 제목';
    const result = normalizeHeadings(input);
    expect(result).toContain('# 소제목');
    expect(result).toContain('## 세부 제목');
  });

  it('h2만 있으면 h1으로 변환', () => {
    expect(normalizeHeadings('## 제목')).toBe('# 제목');
  });

  it('h3만 있으면 h2로 변환', () => {
    expect(normalizeHeadings('### 제목')).toBe('## 제목');
  });

  it('빈 문자열은 그대로 반환', () => {
    expect(normalizeHeadings('')).toBe('');
  });

  it('헤딩이 없는 본문은 그대로 반환', () => {
    const input = '그냥 텍스트입니다.';
    expect(normalizeHeadings(input)).toBe(input);
  });
});
