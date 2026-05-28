import { describe, expect, it } from 'vitest';

import { buildMdxContent, generateSlug } from './translate-posts.js';

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
    const slug = generateSlug('react', 'https://react.dev/blog/react_compiler_v2');
    expect(slug).toBe('react-react-compiler-v2');
  });
});

// ---------------------------------------------------------------------------
// buildMdxContent
// ---------------------------------------------------------------------------
describe('buildMdxContent', () => {
  const meta = {
    title: 'React 컴파일러 소개',
    description: 'React 컴파일러의 동작 방식과 활용법',
    category: 'react',
    sourceUrl: 'https://react.dev/blog/react-compiler',
    sourceName: 'React Blog',
    originalTitle: 'React Compiler',
    translatedBody: '## 개요\n\nReact 컴파일러는...',
  };

  it('frontmatter가 올바르게 포함됨', () => {
    const result = buildMdxContent(meta);
    expect(result).toContain('title: React 컴파일러 소개');
    expect(result).toContain('description: React 컴파일러의 동작 방식과 활용법');
    expect(result).toContain('category: react');
    expect(result).toContain('sourceUrl: https://react.dev/blog/react-compiler');
  });

  it('원문 링크 줄이 포함됨', () => {
    const result = buildMdxContent(meta);
    expect(result).toContain('> 원문: [React Compiler](https://react.dev/blog/react-compiler) — React Blog');
  });

  it('번역 본문이 포함됨', () => {
    const result = buildMdxContent(meta);
    expect(result).toContain('## 개요\n\nReact 컴파일러는...');
  });

  it('frontmatter → 원문 링크 → 본문 순서', () => {
    const result = buildMdxContent(meta);
    const frontmatterEnd = result.indexOf('---\n\n');
    const originLine = result.indexOf('> 원문:');
    const body = result.indexOf('## 개요');
    expect(frontmatterEnd).toBeLessThan(originLine);
    expect(originLine).toBeLessThan(body);
  });
});
