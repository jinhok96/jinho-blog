import * as fs from 'fs';
import * as path from 'path';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

import { isVideoSrc, resolveImageSize } from './image';

const mockReadFileSync = vi.mocked(fs.readFileSync);

const PUBLIC_DIR = path.resolve('/app/public');

/** image-size가 해석할 수 있는 최소 PNG 헤더 (시그니처 + IHDR 너비·높이) */
function createPngHeader(width: number, height: number) {
  const buffer = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer, 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write('IHDR', 12, 'ascii');
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('resolveImageSize', () => {
  it('로컬 이미지 → public 기준 파일의 원본 크기', () => {
    mockReadFileSync.mockReturnValue(createPngHeader(1280, 720));

    expect(resolveImageSize('/_static/mdx/posts/photo.png', PUBLIC_DIR)).toEqual({ width: 1280, height: 720 });
    expect(mockReadFileSync).toHaveBeenCalledWith(path.join(PUBLIC_DIR, '_static/mdx/posts/photo.png'));
  });

  it('쿼리·해시 제거 및 퍼센트 인코딩 해제 후 파일 조회', () => {
    mockReadFileSync.mockReturnValue(createPngHeader(10, 20));

    expect(resolveImageSize('/_static/my%20photo.png?v=1#top', PUBLIC_DIR)).toEqual({ width: 10, height: 20 });
    expect(mockReadFileSync).toHaveBeenCalledWith(path.join(PUBLIC_DIR, '_static/my photo.png'));
  });

  it('파일 없음 → null (경고만 출력)', () => {
    mockReadFileSync.mockImplementation(() => {
      throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    });

    expect(resolveImageSize('/_static/missing.png', PUBLIC_DIR)).toBeNull();
    expect(console.warn).toHaveBeenCalledOnce();
  });

  it('해석할 수 없는 파일 형식 → null', () => {
    mockReadFileSync.mockReturnValue(Buffer.from('not an image'));

    expect(resolveImageSize('/_static/broken.png', PUBLIC_DIR)).toBeNull();
  });

  it.each(['https://example.com/a.png', 'http://example.com/a.png', '//cdn.example.com/a.png', 'images/a.png', ''])(
    '외부·상대 경로 %j → 파일을 읽지 않고 null',
    src => {
      expect(resolveImageSize(src, PUBLIC_DIR)).toBeNull();
      expect(mockReadFileSync).not.toHaveBeenCalled();
    },
  );

  it('public 밖 경로 → 파일을 읽지 않고 null', () => {
    expect(resolveImageSize('/../secret.png', PUBLIC_DIR)).toBeNull();
    expect(resolveImageSize('/_static/%2E%2E/%2E%2E/secret.png', PUBLIC_DIR)).toBeNull();
    expect(mockReadFileSync).not.toHaveBeenCalled();
  });

  it('잘못된 퍼센트 인코딩 → null', () => {
    expect(resolveImageSize('/_static/%E0%A4%A.png', PUBLIC_DIR)).toBeNull();
    expect(mockReadFileSync).not.toHaveBeenCalled();
  });
});

describe('isVideoSrc', () => {
  it.each(['/_static/clip.mp4', '/_static/clip.WEBM', '/_static/clip.mov?autoplay=1'])('%j → true', src => {
    expect(isVideoSrc(src)).toBe(true);
  });

  it.each(['/_static/photo.webp', '/_static/mp4.png', 'https://example.com/video'])('%j → false', src => {
    expect(isVideoSrc(src)).toBe(false);
  });
});
