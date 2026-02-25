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
  rmSync: vi.fn(),
}));

vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    webp: vi.fn().mockReturnThis(),
    toFile: vi.fn().mockResolvedValue({}),
  })),
}));

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('gray-matter', () => ({
  default: vi.fn(),
}));

import {
  buildAllRegistries,
  buildRegistry,
  buildThumbnailSvg,
  extractFirstImage,
  generateBlogThumbnail,
  getGitDates,
  getGitDatesFromAPI,
  getGitDatesFromLocal,
  parseMdxFile,
  scanMdxDirectory,
  transformImagePaths,
  wrapText,
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
const mockRmSync = vi.mocked(fs.rmSync);
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

  it('빌드 시작 시 _generated 디렉토리를 rmSync로 초기화', async () => {
    mockExistsSync.mockReturnValue(false);
    await buildAllRegistries();
    expect(mockRmSync).toHaveBeenCalledWith(expect.stringContaining('_generated'), { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// wrapText
// ---------------------------------------------------------------------------
describe('wrapText', () => {
  it('maxChars 이하의 짧은 텍스트는 1줄 그대로 반환', () => {
    const result = wrapText('Hello', 20);
    expect(result).toEqual(['Hello']);
  });

  it('공백 기준으로 줄 분리', () => {
    const result = wrapText('Hello World Foo Bar', 10);
    expect(result.length).toBeGreaterThan(1);
    expect(result[0]).toBe('Hello');
  });

  it('공백 없이 maxChars 초과 시 글자 수 기준으로 자르기', () => {
    const result = wrapText('ABCDEFGHIJKLMNOPQRST', 5);
    expect(result[0]).toBe('ABCDE');
  });

  it('최대 3줄 제한 초과 시 마지막 줄에 말줄임 추가', () => {
    const longText = 'one two three four five six seven eight nine ten eleven twelve';
    const result = wrapText(longText, 10);
    expect(result.length).toBeLessThanOrEqual(3);
    expect(result[result.length - 1]).toMatch(/…$/);
  });

  it('정확히 3줄에 맞으면 말줄임 없음', () => {
    // maxChars=5, 각 단어가 5자 이하이면 줄당 1단어
    const result = wrapText('ab cd ef', 3);
    expect(result.length).toBe(3);
    // 남은 텍스트 없으면 말줄임 없음
    expect(result[2]).not.toMatch(/…$/);
  });

  it('빈 문자열 입력 시 빈 배열 반환', () => {
    const result = wrapText('', 10);
    expect(result).toEqual([]);
  });

  it('앞뒤 공백은 trim 처리됨', () => {
    const result = wrapText('  Hello  ', 20);
    expect(result).toEqual(['Hello']);
  });

  it('마지막 줄이 maxChars - 1 초과 시 substring 후 말줄임', () => {
    // 4줄 이상 필요한 텍스트: 3줄 채운 뒤 남은 텍스트가 있으면
    // last.length > maxChars - 1 분기 실행
    const result = wrapText('aa bb cc dd ee ff gg hh ii jj', 3);
    expect(result.length).toBe(3);
    expect(result[2]).toMatch(/…$/);
  });
});

// ---------------------------------------------------------------------------
// buildThumbnailSvg
// ---------------------------------------------------------------------------
describe('buildThumbnailSvg', () => {
  it('SVG 문자열 반환 (기본 구조)', () => {
    const result = buildThumbnailSvg('Hello World', null);
    expect(result).toContain('<svg');
    expect(result).toContain('width="1280"');
    expect(result).toContain('height="720"');
    expect(result).toContain('</svg>');
  });

  it('fontBase64 없으면 @font-face 스타일 미포함', () => {
    const result = buildThumbnailSvg('Hello', null);
    expect(result).not.toContain('@font-face');
    expect(result).toContain('Arial, sans-serif');
  });

  it('fontBase64 있으면 @font-face 스타일 포함', () => {
    const result = buildThumbnailSvg('Hello', 'base64encodeddata');
    expect(result).toContain('@font-face');
    expect(result).toContain('Pretendard');
    expect(result).toContain('base64encodeddata');
  });

  it('title에 특수문자 포함 시 HTML 이스케이프 처리', () => {
    const result = buildThumbnailSvg('A & B < C > D "E"', null);
    expect(result).toContain('&amp;');
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
    expect(result).toContain('&quot;');
  });

  it('<text> 요소가 포함됨', () => {
    const result = buildThumbnailSvg('Hello', null);
    expect(result).toContain('<text');
    expect(result).toContain('Hello');
  });

  it('배경 rect 요소 포함', () => {
    const result = buildThumbnailSvg('Hello', null);
    expect(result).toContain('<rect');
    expect(result).toContain('#314158');
  });
});

// ---------------------------------------------------------------------------
// generateBlogThumbnail
// ---------------------------------------------------------------------------
describe('generateBlogThumbnail', () => {
  it('성공 시 WebP 경로 반환', async () => {
    mockReadFileSync.mockReturnValue(Buffer.from('fake-font-data'));
    const result = await generateBlogThumbnail('test-slug', 'Test Title');
    expect(result).toMatch(/test-slug\.webp$/);
    expect(mockMkdirSync).toHaveBeenCalledWith(expect.stringContaining('_generated'), { recursive: true });
  });

  it('sharp 실패 시 undefined 반환 (빌드 중단 없음)', async () => {
    const sharp = await import('sharp');
    vi.mocked(sharp.default).mockImplementationOnce(() => {
      throw new Error('sharp error');
    });

    const result = await generateBlogThumbnail('fail-slug', 'Fail Title');
    expect(result).toBeUndefined();
  });

  it('반환 경로에 slug가 포함됨', async () => {
    mockReadFileSync.mockReturnValue(Buffer.from('fake-font-data'));
    const result = await generateBlogThumbnail('my-post', 'My Post Title');
    expect(result).toContain('my-post');
  });
});
