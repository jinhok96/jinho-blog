import * as fs from 'fs';
import * as path from 'path';

import * as os from 'os';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { defineCollection, defineContentConfig, frontmatterSchema } from '../src/core/collection/index.js';
import { copyContentMedia, ensureDirSync, isImageFile, isVideoFile, scanImagesRecursive } from './copy-mdx-images.js';

let tmpDir: string;

/**
 * tmpDir 기준 파일 생성 후 절대 경로 반환
 */
function writeFile(relativePath: string, content: string = ''): string {
  const filePath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
}

function createConfig(options: { copyProjectsMedia?: boolean } = {}) {
  return defineContentConfig({
    contentDir: path.join(tmpDir, 'content/mdx'),
    staticDir: path.join(tmpDir, 'public/_static'),
    staticUrl: '/_static',
    collections: {
      blog: defineCollection({ route: '/blog', schema: frontmatterSchema }),
      projects: defineCollection({
        route: '/projects',
        schema: frontmatterSchema,
        copyMedia: options.copyProjectsMedia,
      }),
    },
  });
}

function mediaPath(relativePath: string): string {
  return path.join(tmpDir, 'public/_static/mdx', relativePath);
}

beforeAll(() => {
  // console.warn, console.error, console.log 비활성화
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mdx-copy-media-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// isImageFile
// ---------------------------------------------------------------------------
describe('isImageFile', () => {
  it.each(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg'])('%s 확장자 → true', ext => {
    expect(isImageFile(`image${ext}`)).toBe(true);
  });

  it.each(['.ts', '.mdx', '.json', '.txt'])('%s 확장자 → false', ext => {
    expect(isImageFile(`file${ext}`)).toBe(false);
  });

  it('대문자 확장자도 인식 (.PNG, .JPG)', () => {
    expect(isImageFile('image.PNG')).toBe(true);
    expect(isImageFile('image.JPG')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isVideoFile
// ---------------------------------------------------------------------------
describe('isVideoFile', () => {
  it.each(['.mp4', '.webm', '.ogg', '.mov'])('%s 확장자 → true', ext => {
    expect(isVideoFile(`video${ext}`)).toBe(true);
  });

  it.each(['.ts', '.mdx', '.json', '.png'])('%s 확장자 → false', ext => {
    expect(isVideoFile(`file${ext}`)).toBe(false);
  });

  it('대문자 확장자도 인식 (.MP4, .WEBM)', () => {
    expect(isVideoFile('video.MP4')).toBe(true);
    expect(isVideoFile('video.WEBM')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// scanImagesRecursive
// ---------------------------------------------------------------------------
describe('scanImagesRecursive', () => {
  const byRelativePath = (a: { relativePath: string }, b: { relativePath: string }) =>
    a.relativePath.localeCompare(b.relativePath);

  it('디렉토리가 없으면 빈 배열 반환', () => {
    expect(scanImagesRecursive(path.join(tmpDir, 'nonexistent'))).toEqual([]);
  });

  it('이미지 파일 반환, 이미지 아닌 파일은 제외', () => {
    writeFile('dir/photo.webp');
    writeFile('dir/readme.md');
    writeFile('dir/post.mdx');
    writeFile('dir/config.json');

    expect(scanImagesRecursive(path.join(tmpDir, 'dir'))).toEqual([
      { sourcePath: path.join(tmpDir, 'dir/photo.webp'), relativePath: 'photo.webp' },
    ]);
  });

  it('중첩 디렉토리 재귀 탐색', () => {
    writeFile('dir/images/cover.png');

    expect(scanImagesRecursive(path.join(tmpDir, 'dir'))).toEqual([
      { sourcePath: path.join(tmpDir, 'dir/images/cover.png'), relativePath: path.join('images', 'cover.png') },
    ]);
  });

  it('비디오 파일 반환', () => {
    writeFile('dir/demo.mp4');
    writeFile('dir/clip.webm');

    expect(scanImagesRecursive(path.join(tmpDir, 'dir')).sort(byRelativePath)).toEqual([
      { sourcePath: path.join(tmpDir, 'dir/clip.webm'), relativePath: 'clip.webm' },
      { sourcePath: path.join(tmpDir, 'dir/demo.mp4'), relativePath: 'demo.mp4' },
    ]);
  });

  it('baseDir 인수가 relativePath에 반영됨', () => {
    writeFile('dir/image.svg');

    const result = scanImagesRecursive(path.join(tmpDir, 'dir'), 'blog/images');
    expect(result[0].relativePath).toBe(path.join('blog/images', 'image.svg'));
  });
});

// ---------------------------------------------------------------------------
// ensureDirSync
// ---------------------------------------------------------------------------
describe('ensureDirSync', () => {
  it('디렉토리가 이미 존재하면 그대로 유지', () => {
    const filePath = writeFile('existing/file.txt', 'keep');

    ensureDirSync(path.join(tmpDir, 'existing'));
    expect(fs.readFileSync(filePath, 'utf-8')).toBe('keep');
  });

  it('디렉토리가 없으면 재귀 생성', () => {
    const dir = path.join(tmpDir, 'new/nested/dir');

    ensureDirSync(dir);
    expect(fs.statSync(dir).isDirectory()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// copyContentMedia
// ---------------------------------------------------------------------------
describe('copyContentMedia', () => {
  it('컬렉션 디렉토리가 없으면 warn 로그 출력', () => {
    copyContentMedia(createConfig());
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('blog'));
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('projects'));
  });

  it('이미지가 없으면 복사하지 않음', () => {
    writeFile('content/mdx/blog/post.mdx');

    copyContentMedia(createConfig());
    expect(fs.existsSync(mediaPath('blog'))).toBe(false);
  });

  it('이미지·비디오를 상대 경로를 유지해 mediaDir로 복사 (MDX 제외)', () => {
    writeFile('content/mdx/blog/post.mdx');
    writeFile('content/mdx/blog/cover.webp', 'cover');
    writeFile('content/mdx/blog/images/nested.png', 'nested');
    writeFile('content/mdx/projects/videos/demo.mp4', 'video');

    copyContentMedia(createConfig());

    expect(fs.readFileSync(mediaPath('blog/cover.webp'), 'utf-8')).toBe('cover');
    expect(fs.readFileSync(mediaPath('blog/images/nested.png'), 'utf-8')).toBe('nested');
    expect(fs.readFileSync(mediaPath('projects/videos/demo.mp4'), 'utf-8')).toBe('video');
    expect(fs.existsSync(mediaPath('blog/post.mdx'))).toBe(false);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('총 3개 이미지 복사 완료'));
  });

  it('copyMedia: false 컬렉션은 건너뜀', () => {
    writeFile('content/mdx/blog/cover.webp');
    writeFile('content/mdx/projects/cover.webp');

    copyContentMedia(createConfig({ copyProjectsMedia: false }));

    expect(fs.existsSync(mediaPath('blog/cover.webp'))).toBe(true);
    expect(fs.existsSync(mediaPath('projects'))).toBe(false);
  });

  it('상대 경로 설정은 process.cwd()(앱 루트) 기준으로 해석', () => {
    writeFile('apps/web/content/blog/cover.webp');
    const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(path.join(tmpDir, 'apps/web'));

    try {
      copyContentMedia(
        defineContentConfig({
          contentDir: 'content',
          staticDir: 'public/_static',
          staticUrl: '/_static',
          collections: { blog: defineCollection({ route: '/blog', schema: frontmatterSchema }) },
        }),
      );
    } finally {
      cwdSpy.mockRestore();
    }

    expect(fs.existsSync(path.join(tmpDir, 'apps/web/public/_static/mdx/blog/cover.webp'))).toBe(true);
  });

  it('복사 실패 시 error 로그 출력 후 계속 진행', () => {
    writeFile('content/mdx/blog/a.webp');
    writeFile('content/mdx/blog/b.webp');
    // 목적지에 같은 이름의 디렉토리가 있으면 복사 실패
    fs.mkdirSync(mediaPath('blog/a.webp'), { recursive: true });

    copyContentMedia(createConfig());

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('a.webp'), expect.any(String));
    expect(fs.existsSync(mediaPath('blog/b.webp'))).toBe(true);
  });
});
