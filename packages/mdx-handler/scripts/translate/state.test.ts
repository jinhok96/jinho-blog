import * as path from 'path';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { findMonorepoRoot, getMdxDir, getTranslatedInfo } from './state.js';

vi.mock('fs');
vi.mock('gray-matter');

import * as fs from 'fs';
import matter from 'gray-matter';

const mockFsExistsSync = vi.mocked(fs.existsSync);
const mockFsReaddirSync = vi.mocked(fs.readdirSync);
const mockFsReadFileSync = vi.mocked(fs.readFileSync);
const mockMatter = vi.mocked(matter);

describe('getTranslatedInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('디렉토리가 없으면 빈 결과 반환', () => {
    mockFsExistsSync.mockReturnValue(false);

    const result = getTranslatedInfo('/some/dir');

    expect(result.urls.size).toBe(0);
    expect(result.byCategory.size).toBe(0);
  });

  it('MDX 파일에서 sourceUrl과 category 추출', () => {
    mockFsExistsSync.mockReturnValue(true);
    mockFsReaddirSync.mockReturnValue(['react-compiler.mdx', 'next-15.mdx'] as never);
    mockFsReadFileSync.mockReturnValue('---\nsourceUrl: https://example.com\n---' as never);
    mockMatter
      .mockReturnValueOnce({ data: { sourceUrl: 'https://react.dev/blog/compiler', category: 'react' } } as never)
      .mockReturnValueOnce({ data: { sourceUrl: 'https://nextjs.org/blog/next-15', category: 'nextjs' } } as never);

    const result = getTranslatedInfo('/content/translate');

    expect(result.urls.size).toBe(2);
    expect(result.urls.has('https://react.dev/blog/compiler')).toBe(true);
    expect(result.urls.has('https://nextjs.org/blog/next-15')).toBe(true);
    expect(result.byCategory.get('react')?.has('https://react.dev/blog/compiler')).toBe(true);
    expect(result.byCategory.get('nextjs')?.has('https://nextjs.org/blog/next-15')).toBe(true);
  });

  it('sourceUrl 없는 파일은 건너뜀', () => {
    mockFsExistsSync.mockReturnValue(true);
    mockFsReaddirSync.mockReturnValue(['no-url.mdx'] as never);
    mockFsReadFileSync.mockReturnValue('---\ntitle: No URL\n---' as never);
    mockMatter.mockReturnValue({ data: { title: 'No URL' } } as never);

    const result = getTranslatedInfo('/content/translate');

    expect(result.urls.size).toBe(0);
  });

  it('category 없는 파일은 urls에만 추가', () => {
    mockFsExistsSync.mockReturnValue(true);
    mockFsReaddirSync.mockReturnValue(['no-category.mdx'] as never);
    mockFsReadFileSync.mockReturnValue('---\nsourceUrl: https://example.com\n---' as never);
    mockMatter.mockReturnValue({ data: { sourceUrl: 'https://example.com' } } as never);

    const result = getTranslatedInfo('/content/translate');

    expect(result.urls.has('https://example.com')).toBe(true);
    expect(result.byCategory.size).toBe(0);
  });

  it('.mdx 확장자 아닌 파일은 건너뜀', () => {
    mockFsExistsSync.mockReturnValue(true);
    mockFsReaddirSync.mockReturnValue(['file.txt', 'image.png', 'post.mdx'] as never);
    mockFsReadFileSync.mockReturnValue('---\nsourceUrl: https://example.com\ncategory: react\n---' as never);
    mockMatter.mockReturnValue({ data: { sourceUrl: 'https://example.com', category: 'react' } } as never);

    const result = getTranslatedInfo('/content/translate');

    expect(result.urls.size).toBe(1);
    expect(mockFsReadFileSync).toHaveBeenCalledTimes(1);
  });

  it('같은 category의 여러 파일이 같은 Set에 추가됨', () => {
    mockFsExistsSync.mockReturnValue(true);
    mockFsReaddirSync.mockReturnValue(['post1.mdx', 'post2.mdx'] as never);
    mockFsReadFileSync.mockReturnValue('---\n---' as never);
    mockMatter
      .mockReturnValueOnce({ data: { sourceUrl: 'https://react.dev/1', category: 'react' } } as never)
      .mockReturnValueOnce({ data: { sourceUrl: 'https://react.dev/2', category: 'react' } } as never);

    const result = getTranslatedInfo('/content/translate');

    const reactUrls = result.byCategory.get('react')!;
    expect(reactUrls.size).toBe(2);
  });
});

describe('getMdxDir', () => {
  it('monorepoRoot가 주어지면 translate 경로 반환', () => {
    const dir = getMdxDir('/c/vscode/jinho-blog');
    expect(dir).toContain('content');
    expect(dir).toContain('mdx');
    expect(dir).toContain('translate');
  });
});

describe('findMonorepoRoot', () => {
  it('workspaces가 있는 package.json을 현재 디렉토리에서 발견', () => {
    const testDir = path.resolve('/test/monorepo');
    const mockCwd = vi.spyOn(process, 'cwd').mockReturnValue(testDir);
    mockFsExistsSync.mockReturnValue(true);
    mockFsReadFileSync.mockReturnValue(JSON.stringify({ workspaces: ['packages/*'] }) as never);

    const result = findMonorepoRoot();

    expect(result).toBe(testDir);
    mockCwd.mockRestore();
  });

  it('현재 디렉토리에 workspaces 없으면 상위 탐색', () => {
    const parentDir = path.resolve('/test/monorepo');
    const childDir = path.join(parentDir, 'packages', 'mdx-handler');
    const mockCwd = vi.spyOn(process, 'cwd').mockReturnValue(childDir);

    // 첫 3번은 existsSync=true이지만 workspaces 없음, 이후는 workspaces 있음
    let callCount = 0;
    mockFsExistsSync.mockImplementation(() => true);
    mockFsReadFileSync.mockImplementation(() => {
      callCount++;
      if (callCount >= 3) {
        return JSON.stringify({ workspaces: ['packages/*'] }) as never;
      }
      return JSON.stringify({ name: 'sub-package' }) as never;
    });

    const result = findMonorepoRoot();

    expect(result).toBeTruthy();
    mockCwd.mockRestore();
  });

  it('package.json이 없는 디렉토리는 건너뜀', () => {
    const testDir = path.resolve('/test/monorepo');
    const mockCwd = vi.spyOn(process, 'cwd').mockReturnValue(testDir);

    // 첫 번째 existsSync는 false, 두 번째 false, 세 번째 true+workspaces
    let callCount = 0;
    mockFsExistsSync.mockImplementation(() => {
      callCount++;
      return callCount >= 3;
    });
    mockFsReadFileSync.mockReturnValue(JSON.stringify({ workspaces: ['packages/*'] }) as never);

    const result = findMonorepoRoot();

    expect(result).toBeTruthy();
    mockCwd.mockRestore();
  });
});
