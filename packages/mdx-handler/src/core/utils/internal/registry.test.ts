import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { defineCollection, defineContentConfig, frontmatterSchema } from '../../collection/index.js';
import { createContentReader } from './registry.js';

const config = defineContentConfig({
  contentDir: '../../content/mdx',
  staticDir: 'public/_static',
  staticUrl: '/_static',
  collections: {
    blog: defineCollection({ route: '/blog', schema: frontmatterSchema, generateThumbnail: true }),
    projects: defineCollection({ route: '/projects', schema: frontmatterSchema.extend({ tech: z.array(z.string()) }) }),
    libraries: defineCollection({ route: '/libraries', schema: frontmatterSchema }),
  },
});

const MOCK_REGISTRY = {
  blog: [{ slug: 'post-1', filePath: '/blog/post-1.mdx', path: '/blog/post-1' }],
  projects: [{ slug: 'proj-1', filePath: '/projects/proj-1.mdx', path: '/projects/proj-1' }],
  libraries: [],
};

const readRegistry = vi.fn<() => string>();
const reader = createContentReader(config, readRegistry);

function fileNotFoundError(): NodeJS.ErrnoException {
  return Object.assign(new Error("ENOENT: no such file or directory, open 'registry.json'"), { code: 'ENOENT' });
}

beforeAll(() => {
  // console.warn, console.error 비활성화
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
  readRegistry.mockReturnValue(JSON.stringify(MOCK_REGISTRY));
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('createContentReader - getEntries', () => {
  it('정상적으로 blog 컬렉션 반환', () => {
    expect(reader.getEntries('blog')).toEqual(MOCK_REGISTRY.blog);
  });

  it('정상적으로 projects 컬렉션 반환', () => {
    expect(reader.getEntries('projects')).toEqual(MOCK_REGISTRY.projects);
  });

  it('컬렉션에 항목이 없으면 빈 배열 반환', () => {
    expect(reader.getEntries('libraries')).toEqual([]);
  });

  it('registry.json에 해당 컬렉션 키가 없으면 빈 배열 반환', () => {
    readRegistry.mockReturnValue(JSON.stringify({ generatedAt: '2024-01-01' }));

    expect(reader.getEntries('blog')).toEqual([]);
  });

  it('호출 시마다 레지스트리를 다시 읽음 (캐시 없음)', () => {
    reader.getEntries('blog');
    reader.getEntries('blog');

    expect(readRegistry).toHaveBeenCalledTimes(2);
  });

  it('registry.json이 없으면 생성 안내 에러 throw (원인 보존)', () => {
    const cause = fileNotFoundError();
    readRegistry.mockImplementation(() => {
      throw cause;
    });

    expect(() => reader.getEntries('blog')).toThrow("Registry JSON not found. Run 'pnpm registry'");
    expect(() => reader.getEntries('blog')).toThrow(expect.objectContaining({ cause }));
  });

  it('그 외 에러(JSON 파싱 실패 등)는 그대로 throw', () => {
    readRegistry.mockReturnValue('{ invalid json');

    expect(() => reader.getEntries('blog')).toThrow(SyntaxError);
    expect(console.error).toHaveBeenCalledWith('Failed to read registry from JSON:', expect.any(SyntaxError));
  });
});
