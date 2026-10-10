import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const mockToFile = vi.fn();
  const mockJpeg = vi.fn();
  const mockResize = vi.fn();
  const mockSharp = vi.fn();

  return { mockToFile, mockJpeg, mockResize, mockSharp };
});

vi.mock('fs', () => ({
  mkdirSync: vi.fn(),
}));

vi.mock('sharp', () => ({
  default: mocks.mockSharp,
}));

import * as fs from 'fs';

import { generateOgImage, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from './generateOgImage.js';

const mockMkdirSync = vi.mocked(fs.mkdirSync);

beforeEach(() => {
  vi.clearAllMocks();

  mocks.mockToFile.mockResolvedValue({});
  mocks.mockJpeg.mockReturnValue({ toFile: mocks.mockToFile });
  mocks.mockResize.mockReturnValue({ jpeg: mocks.mockJpeg });
  mocks.mockSharp.mockReturnValue({ resize: mocks.mockResize });
});

describe('generateOgImage', () => {
  it('출력 디렉토리를 재귀적으로 생성한다', async () => {
    await generateOgImage({ inputPath: '/in/thumb.webp', outputPath: '/out/og/thumb.jpg' });
    expect(mockMkdirSync).toHaveBeenCalledWith('/out/og', { recursive: true });
  });

  it('입력 이미지를 1200x630 cover로 리사이즈한다', async () => {
    await generateOgImage({ inputPath: '/in/thumb.webp', outputPath: '/out/og/thumb.jpg' });
    expect(mocks.mockSharp).toHaveBeenCalledWith('/in/thumb.webp');
    expect(mocks.mockResize).toHaveBeenCalledWith(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, { fit: 'cover' });
  });

  it('JPEG로 변환하여 outputPath에 저장한다', async () => {
    await generateOgImage({ inputPath: '/in/thumb.webp', outputPath: '/out/og/thumb.jpg' });
    expect(mocks.mockJpeg).toHaveBeenCalledOnce();
    expect(mocks.mockToFile).toHaveBeenCalledWith('/out/og/thumb.jpg');
  });

  it('sharp 변환 에러가 전파된다', async () => {
    mocks.mockToFile.mockRejectedValue(new Error('unsupported image format'));
    await expect(generateOgImage({ inputPath: '/in/broken.webp', outputPath: '/out/og/broken.jpg' })).rejects.toThrow(
      'unsupported image format',
    );
  });
});
