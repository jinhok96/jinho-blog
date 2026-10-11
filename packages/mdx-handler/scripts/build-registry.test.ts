import * as fs from 'fs';
import * as path from 'path';

import { execSync } from 'child_process';
import * as os from 'os';
import { fileURLToPath } from 'url';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('@jinho-blog/thumbnail-generator', () => ({
  generateThumbnail: vi.fn().mockResolvedValue(Buffer.from('')),
  generateOgImage: vi.fn().mockResolvedValue(undefined),
}));

import { generateOgImage, generateThumbnail } from '@jinho-blog/thumbnail-generator';

import { defineCollection, defineContentConfig, frontmatterSchema } from '../src/core/collection/index.js';
import { resolveContentPaths } from '../src/core/paths/index.js';
import {
  buildContentRegistry,
  buildOgImage,
  createGitDatesReader,
  extractFirstImage,
  findMonorepoRoot,
  getGitDatesFromAPI,
  getGitDatesFromLocal,
  parseMdxFile,
  scanMdxDirectory,
  transformImagePaths,
} from './build-registry.js';

const mockExecSync = vi.mocked(execSync);
const mockGenerateThumbnail = vi.mocked(generateThumbnail);
const mockGenerateOgImage = vi.mocked(generateOgImage);

const MEDIA_URL = '/_static/mdx/blog';
const GITHUB = { owner: 'test-owner', repo: 'test-repo' };

const blogSchema = frontmatterSchema.extend({ category: z.enum(['react', 'nextjs']) });

let tmpDir: string;

/**
 * tmpDir 기준 파일 생성 후 절대 경로 반환
 */
function writeFile(relativePath: string, content: string): string {
  const filePath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
}

/**
 * frontmatter(JSON 값은 유효한 YAML) + 본문으로 MDX 문자열 생성
 */
function mdx(frontmatter: Record<string, unknown>, body: string = ''): string {
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  return `---\n${yaml}\n---\n${body}`;
}

function createConfig(options: { github?: typeof GITHUB } = {}) {
  return defineContentConfig({
    contentDir: path.join(tmpDir, 'content/mdx'),
    staticDir: path.join(tmpDir, 'public/_static'),
    staticUrl: '/_static',
    github: options.github,
    collections: {
      blog: defineCollection({ route: '/blog', schema: blogSchema, generateThumbnail: true }),
      projects: defineCollection({ route: '/projects', schema: frontmatterSchema }),
    },
  });
}

type RegistryJson = Record<string, Array<Record<string, unknown>>> & { generatedAt: string };

function readRegistry(): RegistryJson {
  return JSON.parse(fs.readFileSync(path.join(tmpDir, 'public/_static/registry.json'), 'utf-8')) as RegistryJson;
}

function mockFetchCommits(dates: string[]) {
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => dates.map(date => ({ commit: { author: { date } } })),
  });
  vi.stubGlobal('fetch', mockFetch);
  return mockFetch;
}

beforeAll(() => {
  // console.warn, console.error, console.log 비활성화
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
  mockExecSync.mockReset();
  mockExecSync.mockReturnValue('');
  // Vercel 빌드 환경에서도 로컬 git 경로가 기본값이 되도록 초기화
  vi.stubEnv('VERCEL', undefined);
  vi.stubEnv('GITHUB_TOKEN', undefined);
  vi.stubEnv('VERCEL_GIT_COMMIT_REF', undefined);
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mdx-build-registry-'));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// transformImagePaths
// ---------------------------------------------------------------------------
describe('transformImagePaths', () => {
  it('./로 시작하는 상대경로 → 미디어 URL로 변환', () => {
    const result = transformImagePaths('![alt](./images/test.webp)', MEDIA_URL);
    expect(result).toBe('![alt](/_static/mdx/blog/images/test.webp)');
  });

  it('절대 경로 URL은 변환하지 않음', () => {
    const content = '![alt](https://example.com/image.png)';
    expect(transformImagePaths(content, MEDIA_URL)).toBe(content);
  });

  it('여러 이미지 모두 변환', () => {
    const result = transformImagePaths('![a](./a.png) ![b](./b.png)', '/_static/mdx/projects');
    expect(result).toBe('![a](/_static/mdx/projects/a.png) ![b](/_static/mdx/projects/b.png)');
  });

  it('이미지 없는 콘텐츠는 그대로 반환', () => {
    const content = '# Hello\n\nsome text';
    expect(transformImagePaths(content, MEDIA_URL)).toBe(content);
  });

  it('레퍼런스 스타일 정의 [ref]: ./path → 미디어 URL로 변환', () => {
    const result = transformImagePaths('[cover]: ./images/cover.webp', MEDIA_URL);
    expect(result).toBe('[cover]: /_static/mdx/blog/images/cover.webp');
  });

  it('레퍼런스 스타일 정의와 인라인 이미지 혼합: 모두 변환', () => {
    const result = transformImagePaths('![a](./a.png)\n\n[img-b]: ./b.png', MEDIA_URL);
    expect(result).toBe('![a](/_static/mdx/blog/a.png)\n\n[img-b]: /_static/mdx/blog/b.png');
  });

  it('외부 URL 레퍼런스 정의는 변환하지 않음', () => {
    const content = '[link]: https://example.com';
    expect(transformImagePaths(content, MEDIA_URL)).toBe(content);
  });

  it('HTML src="./path" → 미디어 URL로 변환', () => {
    const result = transformImagePaths('<video src="./videos/demo.mp4" />', MEDIA_URL);
    expect(result).toBe('<video src="/_static/mdx/blog/videos/demo.mp4" />');
  });

  it('외부 URL src는 변환하지 않음', () => {
    const content = '<video src="https://example.com/demo.mp4" />';
    expect(transformImagePaths(content, MEDIA_URL)).toBe(content);
  });
});

// ---------------------------------------------------------------------------
// extractFirstImage
// ---------------------------------------------------------------------------
describe('extractFirstImage', () => {
  it('frontmatter thumbnail (외부 URL): 그대로 반환', () => {
    const result = extractFirstImage('https://cdn.example.com/img.png', '', MEDIA_URL);
    expect(result).toBe('https://cdn.example.com/img.png');
  });

  it('frontmatter thumbnail (상대경로 ./): 미디어 URL로 변환', () => {
    const result = extractFirstImage('./images/cover.webp', '', MEDIA_URL);
    expect(result).toBe('/_static/mdx/blog/images/cover.webp');
  });

  it('frontmatter thumbnail (절대 경로): 그대로 반환', () => {
    const result = extractFirstImage('/images/cover.webp', '![first](./first.png)', MEDIA_URL);
    expect(result).toBe('/images/cover.webp');
  });

  it('frontmatter thumbnail 없으면 콘텐츠 첫 이미지 추출', () => {
    const result = extractFirstImage(undefined, '![first](./images/first.png)', '/_static/mdx/projects');
    expect(result).toBe('/_static/mdx/projects/images/first.png');
  });

  it('콘텐츠에 외부 URL 이미지만 있으면 그 URL 반환', () => {
    const result = extractFirstImage(undefined, '![ext](https://cdn.example.com/img.jpg)', MEDIA_URL);
    expect(result).toBe('https://cdn.example.com/img.jpg');
  });

  it('이미지 없으면 undefined 반환', () => {
    const result = extractFirstImage(undefined, '# No images here', MEDIA_URL);
    expect(result).toBeUndefined();
  });

  it('인라인 이미지가 video 확장자(.mp4)이면 스킵하고 undefined 반환', () => {
    const result = extractFirstImage(undefined, '![demo](./videos/demo.mp4)', MEDIA_URL);
    expect(result).toBeUndefined();
  });

  it('외부 URL 이미지가 video 확장자(.mp4)이면 스킵', () => {
    const result = extractFirstImage(undefined, '![demo](https://example.com/video.mp4)', MEDIA_URL);
    expect(result).toBeUndefined();
  });

  it('video URL을 스킵하고 다음 외부 이미지 반환', () => {
    const content = '![video](https://example.com/demo.mp4)\n\n![image](https://cdn.example.com/thumb.webp)';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBe('https://cdn.example.com/thumb.webp');
  });

  it('.webm, .ogg, .mov 확장자도 스킵', () => {
    const content =
      '![a](https://example.com/a.webm)\n![b](https://example.com/b.ogg)\n![c](https://example.com/c.mov)\n![d](https://cdn.example.com/d.png)';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBe('https://cdn.example.com/d.png');
  });

  it('query string 포함 비디오 URL도 스킵', () => {
    const result = extractFirstImage(undefined, '![demo](https://example.com/demo.mp4?t=10)', MEDIA_URL);
    expect(result).toBeUndefined();
  });

  it('hash fragment 포함 비디오 URL도 스킵', () => {
    const result = extractFirstImage(undefined, '![demo](https://example.com/demo.mp4#t=5)', MEDIA_URL);
    expect(result).toBeUndefined();
  });

  it('점으로 끝나는 URL(확장자 없음)은 비디오로 취급하지 않음', () => {
    const result = extractFirstImage(undefined, '![img](https://cdn.example.com/image.)', MEDIA_URL);
    expect(result).toBe('https://cdn.example.com/image.');
  });

  it('외부 URL 이미지에 title 속성이 있어도 URL만 반환', () => {
    const content = '![alt](https://example.com/img.png "Image Title")';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBe('https://example.com/img.png');
  });

  it('레퍼런스 방식 이미지가 인라인보다 앞에 위치: 레퍼런스 이미지 반환', () => {
    const content = '![cover][img-cover]\n\n![second](./second.png)\n\n[img-cover]: ./images/cover.webp';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBe('/_static/mdx/blog/images/cover.webp');
  });

  it('인라인 이미지가 레퍼런스 방식보다 앞에 위치: 인라인 이미지 반환', () => {
    const content = '![first](./first.png)\n\n![ref][img-ref]\n\n[img-ref]: ./ref.webp';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBe('/_static/mdx/blog/first.png');
  });

  it('레퍼런스 방식 이미지만 존재: 해당 이미지 반환', () => {
    const content = '![cover][img-cover]\n\n[img-cover]: ./images/cover.webp';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBe('/_static/mdx/blog/images/cover.webp');
  });

  it('축약형 레퍼런스 ![id][]: 해당 이미지 반환', () => {
    const content = '![Cover][]\n\n[cover]: ./images/cover.webp';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBe('/_static/mdx/blog/images/cover.webp');
  });

  it('레퍼런스 사용은 있지만 ./로 시작하는 정의 없음: undefined 반환', () => {
    const content = '![cover][img-cover]\n\n[img-cover]: https://example.com/cover.webp';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBeUndefined();
  });

  it('레퍼런스 정의가 video이면 스킵', () => {
    const content = '![demo][img-demo]\n\n[img-demo]: ./videos/demo.mp4';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBeUndefined();
  });

  it('축약 레퍼런스 ![id] 이미지: 해당 이미지 반환', () => {
    const content = '![cover-image]\n\n[cover-image]: ./images/cover.webp';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBe('/_static/mdx/blog/images/cover.webp');
  });

  it('축약 레퍼런스가 인라인보다 앞에 위치: 축약 레퍼런스 이미지 반환', () => {
    const content = '![cover-image]\n\n![second](./second.png)\n\n[cover-image]: ./images/cover.webp';
    const result = extractFirstImage(undefined, content, MEDIA_URL);
    expect(result).toBe('/_static/mdx/blog/images/cover.webp');
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
    const result = getGitDatesFromLocal('/some/file.mdx');
    expect(result.createdAt).toBeUndefined();
    expect(result.updatedAt).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getGitDatesFromAPI
// ---------------------------------------------------------------------------
describe('getGitDatesFromAPI', () => {
  const repoRoot = path.resolve('/repo');
  const filePath = path.join(repoRoot, 'content/mdx/blog/post.mdx');

  it('GITHUB_TOKEN 없으면 빈 객체 {} 반환 (fetch 미호출)', async () => {
    const mockFetch = mockFetchCommits([]);

    const result = await getGitDatesFromAPI(filePath, GITHUB, repoRoot);
    expect(result).toEqual({});
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('API 성공: 첫/마지막 커밋에서 createdAt, updatedAt 추출', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    mockFetchCommits([
      '2024-06-01T00:00:00Z', // updatedAt (가장 최근)
      '2024-03-01T00:00:00Z',
      '2024-01-01T00:00:00Z', // createdAt (가장 오래된)
    ]);

    const result = await getGitDatesFromAPI(filePath, GITHUB, repoRoot);
    expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(result.updatedAt).toBe('2024-06-01T00:00:00Z');
  });

  it('config.github 저장소 + 저장소 루트 기준 상대 경로 + 기본 브랜치 main으로 요청', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const mockFetch = mockFetchCommits(['2024-01-01T00:00:00Z']);

    await getGitDatesFromAPI(filePath, GITHUB, repoRoot);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/test-owner/test-repo/commits?path=content/mdx/blog/post.mdx&sha=main&per_page=100',
      {
        headers: {
          Authorization: 'token test-token',
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );
  });

  it('VERCEL_GIT_COMMIT_REF가 있으면 해당 브랜치로 요청', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    vi.stubEnv('VERCEL_GIT_COMMIT_REF', 'dev');
    const mockFetch = mockFetchCommits(['2024-01-01T00:00:00Z']);

    await getGitDatesFromAPI(filePath, GITHUB, repoRoot);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('&sha=dev&'), expect.anything());
  });

  it('API 응답 !ok이면 빈 객체 {} 반환', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403, statusText: 'Forbidden' }));

    const result = await getGitDatesFromAPI(filePath, GITHUB, repoRoot);
    expect(result).toEqual({});
  });

  it('커밋 배열이 비어있으면 빈 객체 {} 반환', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    mockFetchCommits([]);

    const result = await getGitDatesFromAPI(filePath, GITHUB, repoRoot);
    expect(result).toEqual({});
  });

  it('fetch 예외 발생: 빈 객체 {} 반환', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));

    const result = await getGitDatesFromAPI(filePath, GITHUB, repoRoot);
    expect(result).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// createGitDatesReader
// ---------------------------------------------------------------------------
describe('createGitDatesReader', () => {
  it('VERCEL + GITHUB_TOKEN + github 설정이 있으면 API 경로 사용', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const mockFetch = mockFetchCommits(['2024-06-01T00:00:00Z', '2024-01-01T00:00:00Z']);

    const result = await createGitDatesReader(GITHUB)('/some/file.mdx');
    expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(mockFetch).toHaveBeenCalled();
    expect(mockExecSync).not.toHaveBeenCalled();
  });

  it('VERCEL 없으면 로컬 git 경로 사용', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const mockFetch = mockFetchCommits([]);
    mockExecSync.mockReturnValueOnce('2024-01-01T00:00:00Z\n').mockReturnValueOnce('2024-06-01T00:00:00Z\n');

    const result = await createGitDatesReader(GITHUB)('/some/file.mdx');
    expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(mockExecSync).toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('GITHUB_TOKEN 없으면 로컬 git 경로 사용', async () => {
    vi.stubEnv('VERCEL', '1');
    const mockFetch = mockFetchCommits([]);

    await createGitDatesReader(GITHUB)('/some/file.mdx');
    expect(mockExecSync).toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('github 설정이 없으면 Vercel 환경이어도 로컬 git 경로 사용', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const mockFetch = mockFetchCommits([]);

    await createGitDatesReader(undefined)('/some/file.mdx');
    expect(mockExecSync).toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// findMonorepoRoot
// ---------------------------------------------------------------------------
describe('findMonorepoRoot', () => {
  it('pnpm-workspace.yaml 있는 상위 디렉토리 반환', () => {
    writeFile('pnpm-workspace.yaml', "packages:\n  - 'apps/*'\n");
    writeFile('apps/web/package.json', JSON.stringify({ name: 'web' }));

    expect(findMonorepoRoot(path.join(tmpDir, 'apps/web'))).toBe(tmpDir);
  });

  it('workspaces 있는 package.json 발견 시 해당 디렉토리 반환', () => {
    writeFile('package.json', JSON.stringify({ workspaces: ['packages/*'] }));

    expect(findMonorepoRoot(path.join(tmpDir, 'packages/a'))).toBe(tmpDir);
  });

  it('workspaces 없는 package.json은 건너뜀', () => {
    writeFile('package.json', JSON.stringify({ workspaces: ['packages/*'] }));
    writeFile('packages/a/package.json', JSON.stringify({ name: 'inner-package' }));

    expect(findMonorepoRoot(path.join(tmpDir, 'packages/a'))).toBe(tmpDir);
  });

  it('기본값: process.cwd()부터 탐색', () => {
    writeFile('pnpm-workspace.yaml', '');
    const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(path.join(tmpDir, 'apps/web'));

    try {
      expect(findMonorepoRoot()).toBe(tmpDir);
    } finally {
      cwdSpy.mockRestore();
    }
  });

  it('루트까지 찾지 못하면 스크립트 위치 기준 fallback 반환', () => {
    const fsRoot = path.parse(tmpDir).root;
    const expected = path.resolve(fileURLToPath(new URL('../../..', import.meta.url)));

    expect(findMonorepoRoot(fsRoot)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// scanMdxDirectory
// ---------------------------------------------------------------------------
describe('scanMdxDirectory', () => {
  it('디렉토리가 없으면 warn 후 빈 배열 반환', () => {
    const result = scanMdxDirectory(path.join(tmpDir, 'missing'));
    expect(result).toEqual([]);
    expect(console.warn).toHaveBeenCalled();
  });

  it('.mdx 파일만 필터링, 디렉토리·하위 파일은 무시', () => {
    writeFile('blog/post-1.mdx', '');
    writeFile('blog/image.png', '');
    writeFile('blog/post-2.mdx', '');
    writeFile('blog/nested/post-3.mdx', '');

    const result = scanMdxDirectory(path.join(tmpDir, 'blog')).sort((a, b) => a.slug.localeCompare(b.slug));
    expect(result).toEqual([
      { slug: 'post-1', filePath: path.join(tmpDir, 'blog/post-1.mdx') },
      { slug: 'post-2', filePath: path.join(tmpDir, 'blog/post-2.mdx') },
    ]);
  });
});

// ---------------------------------------------------------------------------
// parseMdxFile
// ---------------------------------------------------------------------------
describe('parseMdxFile', () => {
  it('검증 성공: 스키마 출력 data + 본문 content 반환', () => {
    const filePath = writeFile(
      'post.mdx',
      mdx({ title: '  Title  ', description: 'Desc', category: 'react', createdAt: '2024-01-01' }, '# Hello'),
    );

    const result = parseMdxFile(filePath, blogSchema);
    expect(result).toEqual({
      success: true,
      data: { title: 'Title', description: 'Desc', category: 'react', createdAt: '2024-01-01T00:00:00.000Z' },
      content: '# Hello',
    });
  });

  it('YAML 날짜(따옴표 없음)도 ISO 문자열로 정규화', () => {
    const filePath = writeFile('post.mdx', '---\ntitle: T\ndescription: D\ncreatedAt: 2024-01-01\n---\n');

    const result = parseMdxFile(filePath, frontmatterSchema);
    expect(result.success && result.data.createdAt).toBe('2024-01-01T00:00:00.000Z');
  });

  it('검증 실패: 필드 경로 + 메시지 목록 반환', () => {
    const filePath = writeFile('post.mdx', mdx({ title: 'T', description: 'D', category: 'vue' }));

    const result = parseMdxFile(filePath, blogSchema);
    expect(result.success).toBe(false);
    expect(!result.success && result.issues).toEqual([expect.stringMatching(/^category: .+/)]);
  });

  it('정의되지 않은 키: (root) 경로로 strict 에러 반환', () => {
    const filePath = writeFile('post.mdx', mdx({ title: 'T', description: 'D', tags: ['a'] }));

    const result = parseMdxFile(filePath, frontmatterSchema);
    expect(!result.success && result.issues).toEqual([expect.stringMatching(/^\(root\): .*tags/)]);
  });

  it('YAML 파싱 실패: (root) 이슈로 반환', () => {
    const filePath = writeFile('post.mdx', '---\ntitle: [unclosed\n---\n');

    const result = parseMdxFile(filePath, frontmatterSchema);
    expect(!result.success && result.issues).toEqual([expect.stringMatching(/^\(root\): frontmatter 파싱 실패/)]);
  });
});

// ---------------------------------------------------------------------------
// buildContentRegistry
// ---------------------------------------------------------------------------
describe('buildContentRegistry', () => {
  it('컬렉션별 항목 + generatedAt을 registryFile에 기록 (출력 디렉토리 생성)', async () => {
    const filePath = writeFile(
      'content/mdx/blog/post-1.mdx',
      mdx(
        {
          title: 'Post 1',
          description: 'Desc',
          category: 'react',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-02-01T00:00:00.000Z',
        },
        '![cover](./images/cover.webp)\n\n<video src="./demo.mp4" />',
      ),
    );

    await buildContentRegistry(createConfig());

    const registry = readRegistry();
    expect(Object.keys(registry)).toEqual(['blog', 'projects', 'generatedAt']);
    expect(registry.generatedAt).toEqual(expect.any(String));
    expect(registry.projects).toEqual([]);
    expect(registry.blog).toEqual([
      {
        slug: 'post-1',
        title: 'Post 1',
        description: 'Desc',
        category: 'react',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-02-01T00:00:00.000Z',
        thumbnail: '/_static/mdx/blog/images/cover.webp',
        ogImage: '/_static/mdx/blog/og/post-1.jpg',
        content: '![cover](/_static/mdx/blog/images/cover.webp)\n\n<video src="/_static/mdx/blog/demo.mp4" />',
        filePath,
        path: '/blog/post-1',
      },
    ]);
  });

  it('JSON은 2칸 들여쓰기로 기록', async () => {
    await buildContentRegistry(createConfig());

    const raw = fs.readFileSync(path.join(tmpDir, 'public/_static/registry.json'), 'utf-8');
    expect(raw).toBe(JSON.stringify(JSON.parse(raw), null, 2));
  });

  it('path는 컬렉션 route 기준으로 생성', async () => {
    writeFile('content/mdx/projects/my-project.mdx', mdx({ title: 'P', description: 'D' }));

    await buildContentRegistry(createConfig());

    expect(readRegistry().projects[0]).toMatchObject({ slug: 'my-project', path: '/projects/my-project' });
  });

  it('컬렉션 디렉토리가 없으면 warn 후 빈 배열', async () => {
    await buildContentRegistry(createConfig());

    const registry = readRegistry();
    expect(registry.blog).toEqual([]);
    expect(registry.projects).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('MDX directory not found'));
  });

  it('frontmatter에 날짜 없으면 Git 날짜 사용', async () => {
    writeFile('content/mdx/projects/p.mdx', mdx({ title: 'P', description: 'D' }));
    mockExecSync.mockReturnValueOnce('2024-01-01T00:00:00Z\n').mockReturnValueOnce('2024-06-01T00:00:00Z\n');

    await buildContentRegistry(createConfig());

    expect(readRegistry().projects[0]).toMatchObject({
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
    });
  });

  it('frontmatter 날짜가 Git 날짜보다 우선', async () => {
    writeFile('content/mdx/projects/p.mdx', mdx({ title: 'P', description: 'D', createdAt: '2023-05-05' }));
    mockExecSync.mockReturnValueOnce('2024-01-01T00:00:00Z\n').mockReturnValueOnce('2024-06-01T00:00:00Z\n');

    await buildContentRegistry(createConfig());

    expect(readRegistry().projects[0]).toMatchObject({
      createdAt: '2023-05-05T00:00:00.000Z',
      updatedAt: '2024-06-01T00:00:00Z',
    });
  });

  it('frontmatter와 Git 모두 없으면 현재 시각(now) 사용, 수정일은 발행일과 동일', async () => {
    writeFile('content/mdx/projects/p.mdx', mdx({ title: 'P', description: 'D' }));

    const before = new Date().toISOString();
    await buildContentRegistry(createConfig());
    const after = new Date().toISOString();

    const { createdAt, updatedAt } = readRegistry().projects[0] as { createdAt: string; updatedAt: string };
    expect(createdAt >= before && createdAt <= after).toBe(true);
    expect(updatedAt).toBe(createdAt);
  });

  it('gitDates: false면 Git 날짜를 조회하지 않고 frontmatter 날짜만 사용', async () => {
    writeFile('content/mdx/projects/p.mdx', mdx({ title: 'P', description: 'D', createdAt: '2023-05-05' }));
    mockExecSync.mockReturnValue('2024-01-01T00:00:00Z\n');

    await buildContentRegistry({ ...createConfig({ github: GITHUB }), gitDates: false });

    expect(mockExecSync).not.toHaveBeenCalled();
    expect(readRegistry().projects[0]).toMatchObject({
      createdAt: '2023-05-05T00:00:00.000Z',
      updatedAt: '2023-05-05T00:00:00.000Z',
    });
  });

  it('Git 이력이 없으면 수정일은 frontmatter 발행일 (빌드마다 바뀌지 않음)', async () => {
    writeFile('content/mdx/projects/p.mdx', mdx({ title: 'P', description: 'D', createdAt: '2023-05-05' }));

    await buildContentRegistry(createConfig());

    expect(readRegistry().projects[0]).toMatchObject({
      createdAt: '2023-05-05T00:00:00.000Z',
      updatedAt: '2023-05-05T00:00:00.000Z',
    });
  });

  it('generateThumbnail: true + 이미지 없음 → 제목으로 썸네일 생성', async () => {
    writeFile('content/mdx/blog/no-image.mdx', mdx({ title: 'No Image', description: 'D', category: 'react' }));

    await buildContentRegistry(createConfig());

    expect(mockGenerateThumbnail).toHaveBeenCalledWith({
      title: 'No Image',
      outputPath: path.join(tmpDir, 'public/_static/mdx/blog/generated/no-image.webp'),
    });
    expect(readRegistry().blog[0].thumbnail).toBe('/_static/mdx/blog/generated/no-image.webp');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('1개 썸네일 생성 완료'));
  });

  it('generateThumbnail: true + 이미지 있음 → 생성하지 않음', async () => {
    writeFile(
      'content/mdx/blog/with-image.mdx',
      mdx({ title: 'T', description: 'D', category: 'react', thumbnail: 'https://cdn.example.com/a.png' }),
    );

    await buildContentRegistry(createConfig());

    expect(mockGenerateThumbnail).not.toHaveBeenCalled();
    expect(readRegistry().blog[0].thumbnail).toBe('https://cdn.example.com/a.png');
  });

  it('generateThumbnail 미설정 + 이미지 없음 → 생성하지 않고 thumbnail 생략', async () => {
    writeFile('content/mdx/projects/p.mdx', mdx({ title: 'P', description: 'D' }));

    await buildContentRegistry(createConfig());

    expect(mockGenerateThumbnail).not.toHaveBeenCalled();
    expect(readRegistry().projects[0]).not.toHaveProperty('thumbnail');
  });

  it('여러 파일·컬렉션의 검증 실패를 하나의 에러로 일괄 보고', async () => {
    writeFile('content/mdx/blog/a.mdx', mdx({ title: 'A', description: 'D' }));
    writeFile('content/mdx/blog/b.mdx', mdx({ title: 'B', description: 'D', category: 'react', tags: ['x'] }));
    writeFile('content/mdx/blog/ok.mdx', mdx({ title: 'OK', description: 'D', category: 'react' }));
    writeFile('content/mdx/projects/c.mdx', mdx({ title: '', description: 'D' }));

    const error = await buildContentRegistry(createConfig()).then(
      () => null,
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    expect(message.split('\n')[0]).toBe('Frontmatter 검증 실패 (3개 파일)');
    expect(message).toMatch(/\[blog\/a\.mdx\]\n {2}- category: .+/);
    expect(message).toMatch(/\[blog\/b\.mdx\]\n {2}- \(root\): 인식할 수 없는 키: "tags"/);
    expect(message).toMatch(/\[projects\/c\.mdx\]\n {2}- title: .+/);
    expect(message).not.toContain('ok.mdx');
  });

  it('검증 실패 시 Git 조회·썸네일 생성·파일 기록을 시작하지 않음', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const mockFetch = mockFetchCommits([]);
    writeFile('content/mdx/blog/ok.mdx', mdx({ title: 'OK', description: 'D', category: 'react' }));
    writeFile('content/mdx/projects/bad.mdx', mdx({ title: 'Bad' }));

    await expect(buildContentRegistry(createConfig({ github: GITHUB }))).rejects.toThrow('Frontmatter 검증 실패');

    expect(mockExecSync).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockGenerateThumbnail).not.toHaveBeenCalled();
    expect(fs.existsSync(path.join(tmpDir, 'public/_static/registry.json'))).toBe(false);
  });

  it('Vercel 환경 + config.github: 모노레포 루트 기준 경로로 GitHub API 사용', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const mockFetch = mockFetchCommits(['2024-06-01T00:00:00Z', '2024-01-01T00:00:00Z']);
    writeFile('pnpm-workspace.yaml', '');
    writeFile('content/mdx/projects/p.mdx', mdx({ title: 'P', description: 'D' }));
    const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(path.join(tmpDir, 'apps/web'));

    try {
      await buildContentRegistry(createConfig({ github: GITHUB }));
    } finally {
      cwdSpy.mockRestore();
    }

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/test-owner/test-repo/commits?path=content/mdx/projects/p.mdx&sha=main&per_page=100',
      expect.anything(),
    );
    expect(mockExecSync).not.toHaveBeenCalled();
    expect(readRegistry().projects[0]).toMatchObject({
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
    });
  });

  it('Vercel 환경이어도 config.github 없으면 GitHub API 미사용', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const mockFetch = mockFetchCommits([]);
    writeFile('content/mdx/projects/p.mdx', mdx({ title: 'P', description: 'D' }));

    await buildContentRegistry(createConfig());

    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockExecSync).toHaveBeenCalled();
  });

  it('상대 경로 설정은 process.cwd()(앱 루트) 기준으로 해석', async () => {
    writeFile('apps/web/content/projects/p.mdx', mdx({ title: 'P', description: 'D' }));
    const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(path.join(tmpDir, 'apps/web'));

    try {
      await buildContentRegistry(
        defineContentConfig({
          contentDir: 'content',
          staticDir: 'public/_static',
          staticUrl: '/_static',
          collections: { projects: defineCollection({ route: '/projects', schema: frontmatterSchema }) },
        }),
      );
    } finally {
      cwdSpy.mockRestore();
    }

    const registryFile = path.join(tmpDir, 'apps/web/public/_static/registry.json');
    const registry = JSON.parse(fs.readFileSync(registryFile, 'utf-8')) as RegistryJson;
    expect(registry.projects[0].filePath).toBe(path.join(tmpDir, 'apps/web/content/projects/p.mdx'));
  });

  it('완료 후 컬렉션별 항목 수 요약 로그 출력', async () => {
    writeFile('content/mdx/projects/p.mdx', mdx({ title: 'P', description: 'D' }));

    await buildContentRegistry(createConfig());

    expect(console.log).toHaveBeenCalledWith('📊 Total entries: blog=0, projects=1');
  });
});

// ---------------------------------------------------------------------------
// buildOgImage
// ---------------------------------------------------------------------------
describe('buildOgImage', () => {
  const paths = () => resolveContentPaths(createConfig());

  it('로컬 썸네일이면 JPEG OG 이미지를 생성하고 URL 경로를 반환한다', async () => {
    const result = await buildOgImage('/_static/mdx/blog/generated/post-1.webp', 'blog', 'post-1', paths());

    expect(result).toBe('/_static/mdx/blog/og/post-1.jpg');
    expect(mockGenerateOgImage).toHaveBeenCalledWith({
      inputPath: path.join(tmpDir, 'public/_static/mdx/blog/generated/post-1.webp'),
      outputPath: path.join(tmpDir, 'public/_static/mdx/blog/og/post-1.jpg'),
    });
  });

  it('다른 컬렉션 미디어의 썸네일도 해당 경로에서 변환한다', async () => {
    const result = await buildOgImage('/_static/mdx/projects/assets/cover.webp', 'blog', 'post-1', paths());

    expect(result).toBe('/_static/mdx/blog/og/post-1.jpg');
    expect(mockGenerateOgImage).toHaveBeenCalledWith(
      expect.objectContaining({ inputPath: path.join(tmpDir, 'public/_static/mdx/projects/assets/cover.webp') }),
    );
  });

  it('미디어 루트 밖을 가리키는 경로(../)는 생성하지 않는다', async () => {
    const result = await buildOgImage('/_static/mdx/../../../secret.png', 'blog', 'post-1', paths());

    expect(result).toBeUndefined();
    expect(mockGenerateOgImage).not.toHaveBeenCalled();
    expect(vi.mocked(console.warn)).toHaveBeenCalledWith(expect.stringContaining('미디어 디렉토리 밖'));
  });

  it('외부 URL 썸네일이면 생성하지 않는다', async () => {
    const result = await buildOgImage('https://example.com/image.png', 'translate', 'post-1', paths());

    expect(result).toBeUndefined();
    expect(mockGenerateOgImage).not.toHaveBeenCalled();
  });

  it('썸네일이 없으면 생성하지 않는다', async () => {
    const result = await buildOgImage(undefined, 'projects', 'project-1', paths());

    expect(result).toBeUndefined();
    expect(mockGenerateOgImage).not.toHaveBeenCalled();
  });

  it('변환에 실패하면 경고 후 undefined를 반환한다', async () => {
    mockGenerateOgImage.mockRejectedValueOnce(new Error('unsupported image format'));

    const result = await buildOgImage('/_static/mdx/projects/assets/broken.webp', 'projects', 'broken', paths());

    expect(result).toBeUndefined();
    expect(vi.mocked(console.warn)).toHaveBeenCalledWith(expect.stringContaining('broken'));
  });

  it('레지스트리 항목에 ogImage 포함 (생성된 썸네일 기준), 외부 썸네일은 제외', async () => {
    writeFile('content/mdx/blog/no-image.mdx', mdx({ title: 'T', description: 'D', category: 'react' }));
    writeFile(
      'content/mdx/projects/external.mdx',
      mdx({ title: 'P', description: 'D', thumbnail: 'https://cdn.example.com/a.png' }),
    );

    await buildContentRegistry(createConfig());

    const registry = readRegistry();
    expect(registry.blog[0].ogImage).toBe('/_static/mdx/blog/og/no-image.jpg');
    expect(registry.projects[0]).not.toHaveProperty('ogImage');
  });
});
