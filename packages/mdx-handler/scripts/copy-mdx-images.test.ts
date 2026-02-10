import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
}));

import { findMonorepoRoot, isImageFile, scanImagesRecursive } from './copy-mdx-images.js';

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

beforeAll(() => {
  // console.warn, console.error 비활성화
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
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
// scanImagesRecursive
// ---------------------------------------------------------------------------
describe('scanImagesRecursive', () => {
  it('디렉토리가 없으면 빈 배열 반환', () => {
    mockExistsSync.mockReturnValue(false);
    expect(scanImagesRecursive('/nonexistent')).toEqual([]);
  });

  it('이미지 파일 반환', () => {
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([
      { name: 'photo.webp', isFile: () => true, isDirectory: () => false },
      { name: 'readme.md', isFile: () => true, isDirectory: () => false },
    ]);

    const result = scanImagesRecursive('/some/dir');
    expect(result).toHaveLength(1);
    expect(result[0].sourcePath).toBe(path.join('/some/dir', 'photo.webp'));
    expect(result[0].relativePath).toBe('photo.webp');
  });

  it('중첩 디렉토리 재귀 탐색', () => {
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync
      .mockReturnValueOnce([{ name: 'images', isFile: () => false, isDirectory: () => true }])
      .mockReturnValueOnce([{ name: 'cover.png', isFile: () => true, isDirectory: () => false }]);

    const result = scanImagesRecursive('/some/dir');
    expect(result).toHaveLength(1);
    expect(result[0].relativePath).toBe(path.join('images', 'cover.png'));
  });

  it('이미지 아닌 파일은 제외', () => {
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([
      { name: 'post.mdx', isFile: () => true, isDirectory: () => false },
      { name: 'config.json', isFile: () => true, isDirectory: () => false },
    ]);

    const result = scanImagesRecursive('/some/dir');
    expect(result).toEqual([]);
  });

  it('baseDir 인수가 relativePath에 반영됨', () => {
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([{ name: 'image.svg', isFile: () => true, isDirectory: () => false }]);

    const result = scanImagesRecursive('/some/dir', 'blog/images');
    expect(result[0].relativePath).toBe(path.join('blog/images', 'image.svg'));
  });
});

// ---------------------------------------------------------------------------
// findMonorepoRoot
// ---------------------------------------------------------------------------
describe('findMonorepoRoot', () => {
  it('workspaces 있는 package.json 발견 시 해당 디렉토리 반환', () => {
    mockExistsSync.mockImplementation((p: fs.PathLike) => {
      return String(p).endsWith('package.json');
    });
    mockReadFileSync.mockReturnValue(JSON.stringify({ workspaces: ['packages/*'] }));

    const result = findMonorepoRoot();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('workspaces 없는 package.json은 건너뜀', () => {
    let callCount = 0;
    mockExistsSync.mockImplementation((p: fs.PathLike) => {
      return String(p).endsWith('package.json');
    });
    mockReadFileSync.mockImplementation(() => {
      callCount++;
      // 두 번째 호출에서 workspaces 포함
      return callCount >= 2
        ? JSON.stringify({ workspaces: ['packages/*'] })
        : JSON.stringify({ name: 'inner-package' });
    });

    const result = findMonorepoRoot();
    expect(typeof result).toBe('string');
  });
});
