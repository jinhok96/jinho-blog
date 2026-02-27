import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { execSync } from 'child_process';
import * as fs from 'fs';
import matter from 'gray-matter';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('gray-matter', () => ({
  default: vi.fn(),
}));

vi.mock('@jinho-blog/thumbnail-generator', () => ({
  generateThumbnail: vi.fn().mockResolvedValue(Buffer.from('')),
}));

import {
  buildAllRegistries,
  buildRegistry,
  extractFirstImage,
  getGitDates,
  getGitDatesFromAPI,
  getGitDatesFromLocal,
  parseMdxFile,
  scanMdxDirectory,
  transformImagePaths,
} from './build-registry.js';

type MockReaddirSync = (
  path: fs.PathLike,
  options: fs.ObjectEncodingOptions & {
    withFileTypes: true;
    recursive?: boolean | undefined;
  },
) => Pick<fs.Dirent, 'name' | 'isFile' | 'isDirectory'>[];

const mockExistsSync = vi.mocked(fs.existsSync);
const mockReaddirSync = vi.mocked<MockReaddirSync>(fs.readdirSync);
const mockReadFileSync = vi.mocked(fs.readFileSync);
const mockWriteFileSync = vi.mocked(fs.writeFileSync);
const mockMkdirSync = vi.mocked(fs.mkdirSync);
const mockExecSync = vi.mocked(execSync);
const mockMatter = vi.mocked(matter);

beforeAll(() => {
  // console.warn, console.error, console.log 비활성화
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
  // findMonorepoRoot 모듈 레벨 호출 시 while 루프가 빠르게 빠져나오도록
  mockExistsSync.mockReturnValue(false);
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// transformImagePaths
// ---------------------------------------------------------------------------
describe('transformImagePaths', () => {
  it('./로 시작하는 상대경로 → static 절대경로로 변환', () => {
    const result = transformImagePaths('![alt](./images/test.webp)', 'blog');
    expect(result).toBe('![alt](/_static/mdx/blog/images/test.webp)');
  });

  it('section이 null이면 원본 콘텐츠 반환', () => {
    const content = '![alt](./images/test.webp)';
    expect(transformImagePaths(content, null)).toBe(content);
  });

  it('절대 경로 URL은 변환하지 않음', () => {
    const content = '![alt](https://example.com/image.png)';
    expect(transformImagePaths(content, 'blog')).toBe(content);
  });

  it('여러 이미지 모두 변환', () => {
    const result = transformImagePaths('![a](./a.png) ![b](./b.png)', 'projects');
    expect(result).toBe('![a](/_static/mdx/projects/a.png) ![b](/_static/mdx/projects/b.png)');
  });

  it('이미지 없는 콘텐츠는 그대로 반환', () => {
    const content = '# Hello\n\nsome text';
    expect(transformImagePaths(content, 'blog')).toBe(content);
  });
});

// ---------------------------------------------------------------------------
// extractFirstImage
// ---------------------------------------------------------------------------
describe('extractFirstImage', () => {
  it('frontmatter thumbnail (외부 URL): 그대로 반환', () => {
    const result = extractFirstImage({ thumbnail: 'https://cdn.example.com/img.png' }, '', 'blog');
    expect(result).toBe('https://cdn.example.com/img.png');
  });

  it('frontmatter thumbnail (상대경로 ./): 절대경로로 변환', () => {
    const result = extractFirstImage({ thumbnail: './images/cover.webp' }, '', 'blog');
    expect(result).toBe('/_static/mdx/blog/images/cover.webp');
  });

  it('frontmatter thumbnail 없으면 콘텐츠 첫 이미지 추출', () => {
    const result = extractFirstImage({}, '![first](./images/first.png)', 'projects');
    expect(result).toBe('/_static/mdx/projects/images/first.png');
  });

  it('콘텐츠에 외부 URL 이미지만 있으면 그 URL 반환', () => {
    const result = extractFirstImage({}, '![ext](https://cdn.example.com/img.jpg)', 'blog');
    expect(result).toBe('https://cdn.example.com/img.jpg');
  });

  it('이미지 없으면 undefined 반환', () => {
    const result = extractFirstImage({}, '# No images here', 'blog');
    expect(result).toBeUndefined();
  });

  it('frontmatter thumbnail이 ./이지만 section이 null: 변환 없이 반환', () => {
    const result = extractFirstImage({ thumbnail: './cover.png' }, '', null);
    expect(result).toBe('./cover.png');
  });
});

// ---------------------------------------------------------------------------
// getGitDatesFromLocal
// ---------------------------------------------------------------------------
describe('getGitDatesFromLocal', () => {
  it('execSync 성공: createdAt, updatedAt 반환', () => {
    mockExecSync.mockReturnValueOnce('2024-01-01T00:00:00+09:00\n').mockReturnValueOnce('2024-06-01T00:00:00+09:00\n');

    const result = getGitDatesFromLocal('/some/file.mdx');
    expect(result.createdAt).toBe('2024-01-01T00:00:00+09:00');
    expect(result.updatedAt).toBe('2024-06-01T00:00:00+09:00');
  });

  it('execSync 예외 발생: 빈 객체 {} 반환', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('git not found');
    });

    const result = getGitDatesFromLocal('/some/file.mdx');
    expect(result).toEqual({});
  });

  it('git 결과가 빈 문자열: undefined 반환', () => {
    mockExecSync.mockReturnValueOnce('').mockReturnValueOnce('');

    const result = getGitDatesFromLocal('/some/file.mdx');
    expect(result.createdAt).toBeUndefined();
    expect(result.updatedAt).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getGitDatesFromAPI
// ---------------------------------------------------------------------------
describe('getGitDatesFromAPI', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('GITHUB_TOKEN 없으면 빈 객체 {} 반환', async () => {
    delete process.env.GITHUB_TOKEN;
    const result = await getGitDatesFromAPI('/some/file.mdx');
    expect(result).toEqual({});
  });

  it('API 성공: 첫/마지막 커밋에서 createdAt, updatedAt 추출', async () => {
    process.env.GITHUB_TOKEN = 'test-token';

    const mockCommits = [
      { commit: { author: { date: '2024-06-01T00:00:00Z' } } }, // updatedAt (가장 최근)
      { commit: { author: { date: '2024-03-01T00:00:00Z' } } },
      { commit: { author: { date: '2024-01-01T00:00:00Z' } } }, // createdAt (가장 오래된)
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCommits,
    });

    const result = await getGitDatesFromAPI('/some/file.mdx');
    expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(result.updatedAt).toBe('2024-06-01T00:00:00Z');
  });

  it('API 응답 !ok이면 빈 객체 {} 반환', async () => {
    process.env.GITHUB_TOKEN = 'test-token';

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    const result = await getGitDatesFromAPI('/some/file.mdx');
    expect(result).toEqual({});
  });

  it('커밋 배열이 비어있으면 빈 객체 {} 반환', async () => {
    process.env.GITHUB_TOKEN = 'test-token';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await getGitDatesFromAPI('/some/file.mdx');
    expect(result).toEqual({});
  });

  it('fetch 예외 발생: 빈 객체 {} 반환', async () => {
    process.env.GITHUB_TOKEN = 'test-token';

    global.fetch = vi.fn().mockRejectedValue(new Error('network error'));

    const result = await getGitDatesFromAPI('/some/file.mdx');
    expect(result).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// getGitDates
// ---------------------------------------------------------------------------
describe('getGitDates', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('VERCEL=true이고 GITHUB_TOKEN 있으면 API 경로 사용', async () => {
    process.env.VERCEL = 'true';
    process.env.GITHUB_TOKEN = 'test-token';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { commit: { author: { date: '2024-06-01T00:00:00Z' } } },
        { commit: { author: { date: '2024-01-01T00:00:00Z' } } },
      ],
    });

    const result = await getGitDates('/some/file.mdx');
    expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(global.fetch).toHaveBeenCalled();
  });

  it('VERCEL 없으면 로컬 git 경로 사용', async () => {
    delete process.env.VERCEL;
    mockExecSync
      .mockReturnValueOnce('2024-01-01T00:00:00Z\n')
      .mockReturnValueOnce('2024-06-01T00:00:00Z\n');

    const result = await getGitDates('/some/file.mdx');
    expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(mockExecSync).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// scanMdxDirectory
// ---------------------------------------------------------------------------
describe('scanMdxDirectory', () => {
  it('디렉토리가 없으면 빈 배열 반환', () => {
    mockExistsSync.mockReturnValue(false);
    const result = scanMdxDirectory('blog');
    expect(result).toEqual([]);
  });

  it('.mdx 파일만 필터링', () => {
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([
      { name: 'post-1.mdx', isFile: () => true, isDirectory: () => false },
      { name: 'image.png', isFile: () => true, isDirectory: () => false },
      { name: 'post-2.mdx', isFile: () => true, isDirectory: () => false },
    ]);

    const result = scanMdxDirectory('blog');
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('post-1');
    expect(result[1].slug).toBe('post-2');
  });

  it('디렉토리 항목은 무시', () => {
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([
      { name: 'images', isFile: () => false, isDirectory: () => true },
      { name: 'post.mdx', isFile: () => true, isDirectory: () => false },
    ]);

    const result = scanMdxDirectory('blog');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('post');
  });
});

// ---------------------------------------------------------------------------
// parseMdxFile
// ---------------------------------------------------------------------------
describe('parseMdxFile', () => {
  beforeEach(() => {
    delete process.env.VERCEL;
    mockReadFileSync.mockReturnValue('mock file content');
  });

  it('frontmatter + content 파싱 후 metadata 반환', async () => {
    mockMatter.mockReturnValue({ data: { title: 'Test Post', createdAt: '2024-01-01' }, content: '# Hello' } as never);
    mockExecSync.mockReturnValue('');

    const result = await parseMdxFile('/test/post.mdx', 'blog');
    expect(result.title).toBe('Test Post');
    expect(result.createdAt).toBe('2024-01-01');
  });

  it('frontmatter에 createdAt 없으면 gitDates.createdAt 사용', async () => {
    mockMatter.mockReturnValue({ data: { title: 'Post' }, content: '' } as never);
    mockExecSync
      .mockReturnValueOnce('2024-01-01T00:00:00Z\n')
      .mockReturnValueOnce('2024-06-01T00:00:00Z\n');

    const result = await parseMdxFile('/test/post.mdx', 'blog');
    expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(result.updatedAt).toBe('2024-06-01T00:00:00Z');
  });

  it('frontmatter와 git 모두 없으면 현재 시간(now) 사용', async () => {
    mockMatter.mockReturnValue({ data: {}, content: '' } as never);
    mockExecSync.mockReturnValue('');

    const before = new Date().toISOString();
    const result = await parseMdxFile('/test/post.mdx', 'blog');
    const after = new Date().toISOString();

    expect((result.createdAt as string) >= before).toBe(true);
    expect((result.createdAt as string) <= after).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildRegistry
// ---------------------------------------------------------------------------
describe('buildRegistry', () => {
  it('섹션 디렉토리 없으면 빈 배열 반환', async () => {
    mockExistsSync.mockReturnValue(false);
    const result = await buildRegistry('blog');
    expect(result).toEqual([]);
  });

  it('MDX 파일이 있으면 entries 배열 반환', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([
      { name: 'post-1.mdx', isFile: () => true, isDirectory: () => false },
    ]);
    mockReadFileSync.mockReturnValue('mock content');
    mockMatter.mockReturnValue({ data: { title: 'Post 1', createdAt: '2024-01-01' }, content: '' } as never);
    mockExecSync.mockReturnValue('');

    const result = await buildRegistry('blog');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('post-1');
    expect(result[0].path).toBe('/blog/post-1');
  });
});

// ---------------------------------------------------------------------------
// buildAllRegistries
// ---------------------------------------------------------------------------
describe('buildAllRegistries', () => {
  it('출력 디렉토리가 없으면 mkdirSync 호출됨', async () => {
    mockExistsSync.mockReturnValue(false);
    await buildAllRegistries();
    expect(mockMkdirSync).toHaveBeenCalled();
  });

  it('모든 섹션 처리 후 writeFileSync 호출됨', async () => {
    mockExistsSync.mockReturnValue(false);
    await buildAllRegistries();
    expect(mockWriteFileSync).toHaveBeenCalled();
  });

  it('writeFileSync에 전달된 JSON에 generatedAt 포함됨', async () => {
    mockExistsSync.mockReturnValue(false);
    await buildAllRegistries();

    const [, content] = mockWriteFileSync.mock.calls[0];
    const parsed = JSON.parse(content as string);
    expect(parsed).toHaveProperty('generatedAt');
    expect(parsed).toHaveProperty('blog');
    expect(parsed).toHaveProperty('projects');
    expect(parsed).toHaveProperty('libraries');
  });

});

// ---------------------------------------------------------------------------
// parseMdxFile - thumbnail undefined 케이스
// ---------------------------------------------------------------------------
describe('parseMdxFile - thumbnail', () => {
  beforeEach(() => {
    delete process.env.VERCEL;
    mockReadFileSync.mockReturnValue('mock file content');
  });

  it('이미지가 없는 blog 글이면 thumbnail이 undefined', async () => {
    mockMatter.mockReturnValue({ data: { title: 'No Image Post' }, content: '# No images here' } as never);
    mockExecSync.mockReturnValue('');

    const result = await parseMdxFile('/test/no-image-post.mdx', 'blog');
    expect(result.thumbnail).toBeUndefined();
  });
});
