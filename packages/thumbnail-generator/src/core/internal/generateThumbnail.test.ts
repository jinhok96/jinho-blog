import { beforeEach, describe, expect, it, vi } from 'vitest';

// vi.hoisted로 mock 함수를 먼저 선언하여 vi.mock 팩토리에서 참조 가능하게 함
const mocks = vi.hoisted(() => {
  const mockAsPng = vi.fn();
  const mockRender = vi.fn();
  class MockResvg {
    render = mockRender;
  }
  const mockToBuffer = vi.fn();
  const mockWebp = vi.fn();
  const mockSharp = vi.fn();

  return { mockAsPng, mockRender, MockResvg, mockToBuffer, mockWebp, mockSharp };
});

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock('path', async importOriginal => {
  const actual = await importOriginal<typeof import('path')>();
  return {
    ...actual,
    dirname: vi.fn((p: string) => actual.dirname(p)),
    join: vi.fn((...args: string[]) => actual.join(...args)),
  };
});

vi.mock('url', () => ({
  fileURLToPath: vi.fn(() => '/mocked/path/to/generateThumbnail.ts'),
}));

vi.mock('@resvg/resvg-js', () => ({
  Resvg: mocks.MockResvg,
}));

vi.mock('satori', () => ({
  default: vi.fn(),
}));

vi.mock('sharp', () => ({
  default: mocks.mockSharp,
}));

import * as fs from 'fs';
import satori from 'satori';

import { generateThumbnail, loadFont } from './generateThumbnail.js';

const mockReadFileSync = vi.mocked(fs.readFileSync);
const mockMkdirSync = vi.mocked(fs.mkdirSync);
const mockWriteFileSync = vi.mocked(fs.writeFileSync);
const mockSatori = vi.mocked(satori);

const mockPngBuffer = Buffer.from('mock-png-data');
const mockWebpBuffer = Buffer.from('mock-webp-data');

beforeEach(() => {
  vi.clearAllMocks();

  const mockFontData = Buffer.alloc(16);
  mockReadFileSync.mockReturnValue(mockFontData);
  mockSatori.mockResolvedValue('<svg>mock</svg>');
  mocks.mockAsPng.mockReturnValue(mockPngBuffer);
  mocks.mockRender.mockReturnValue({ asPng: mocks.mockAsPng });
  mocks.mockToBuffer.mockResolvedValue(mockWebpBuffer);
  mocks.mockWebp.mockReturnValue({ toBuffer: mocks.mockToBuffer });
  mocks.mockSharp.mockReturnValue({ webp: mocks.mockWebp });
});

// ---------------------------------------------------------------------------
// loadFont
// ---------------------------------------------------------------------------
describe('loadFont', () => {
  it('fs.readFileSync를 호출하여 폰트 파일을 읽는다', () => {
    loadFont();
    expect(mockReadFileSync).toHaveBeenCalledOnce();
  });

  it('ArrayBuffer를 반환한다', () => {
    const result = loadFont();
    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  it('Buffer의 내용이 올바르게 ArrayBuffer로 변환된다', () => {
    mockReadFileSync.mockReturnValue(Buffer.from([1, 2, 3, 4]));
    const result = loadFont();
    const view = new Uint8Array(result);
    expect(Array.from(view)).toEqual([1, 2, 3, 4]);
  });

  it('readFileSync가 던진 에러가 전파된다', () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error('font file not found');
    });
    expect(() => loadFont()).toThrow('font file not found');
  });
});

// ---------------------------------------------------------------------------
// generateThumbnail - 기본 동작
// ---------------------------------------------------------------------------
describe('generateThumbnail', () => {
  it('webp Buffer를 반환한다', async () => {
    const result = await generateThumbnail({ title: 'Hello World' });
    expect(result).toBe(mockWebpBuffer);
  });

  it('satori를 1280x720 설정으로 호출한다', async () => {
    await generateThumbnail({ title: 'Hello World' });
    expect(mockSatori).toHaveBeenCalledOnce();
    const [, options] = mockSatori.mock.calls[0] as [unknown, Record<string, unknown>];
    expect(options['width']).toBe(1280);
    expect(options['height']).toBe(720);
  });

  it('satori의 fonts 옵션에 Pretendard weight:900 폰트가 포함된다', async () => {
    await generateThumbnail({ title: 'Hello World' });
    const [, options] = mockSatori.mock.calls[0] as [unknown, Record<string, unknown>];
    const fonts = options['fonts'] as Record<string, unknown>[];
    expect(fonts).toHaveLength(1);
    expect(fonts[0]['name']).toBe('Pretendard');
    expect(fonts[0]['weight']).toBe(900);
    expect(fonts[0]['style']).toBe('normal');
  });

  it('satori에 전달되는 노드에 title이 포함된다', async () => {
    await generateThumbnail({ title: 'My Blog Post' });
    const [node] = mockSatori.mock.calls[0];
    const nodeStr = JSON.stringify(node);
    expect(nodeStr).toContain('My Blog Post');
  });

  it('Resvg를 width:1280 fitTo 옵션으로 생성한다', async () => {
    await generateThumbnail({ title: 'Hello' });
    expect(mocks.mockRender).toHaveBeenCalledOnce();
  });

  it('resvg.render().asPng()를 호출하여 PNG 버퍼를 얻는다', async () => {
    await generateThumbnail({ title: 'Hello' });
    expect(mocks.mockRender).toHaveBeenCalledOnce();
    expect(mocks.mockAsPng).toHaveBeenCalledOnce();
  });

  it('sharp를 PNG 버퍼로 호출하고 webp quality:90으로 변환한다', async () => {
    await generateThumbnail({ title: 'Hello' });
    expect(mocks.mockSharp).toHaveBeenCalledWith(mockPngBuffer);
    expect(mocks.mockWebp).toHaveBeenCalledWith({ quality: 90 });
    expect(mocks.mockToBuffer).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// generateThumbnail - outputPath 없음
// ---------------------------------------------------------------------------
describe('generateThumbnail - outputPath 미지정', () => {
  it('outputPath 없으면 mkdirSync를 호출하지 않는다', async () => {
    await generateThumbnail({ title: 'No Output' });
    expect(mockMkdirSync).not.toHaveBeenCalled();
  });

  it('outputPath 없으면 writeFileSync를 호출하지 않는다', async () => {
    await generateThumbnail({ title: 'No Output' });
    expect(mockWriteFileSync).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// generateThumbnail - outputPath 있음
// ---------------------------------------------------------------------------
describe('generateThumbnail - outputPath 지정', () => {
  it('outputPath 있으면 mkdirSync를 recursive:true로 호출한다', async () => {
    await generateThumbnail({ title: 'With Output', outputPath: '/output/thumbnails/post.webp' });
    expect(mockMkdirSync).toHaveBeenCalledOnce();
    const [, options] = mockMkdirSync.mock.calls[0];
    expect(options).toEqual({ recursive: true });
  });

  it('mkdirSync에 outputPath의 디렉토리 경로를 전달한다', async () => {
    await generateThumbnail({ title: 'With Output', outputPath: '/output/thumbnails/post.webp' });
    const [dirPath] = mockMkdirSync.mock.calls[0];
    expect(dirPath).toBe('/output/thumbnails');
  });

  it('outputPath 있으면 writeFileSync를 webp 버퍼로 호출한다', async () => {
    await generateThumbnail({ title: 'With Output', outputPath: '/output/thumbnails/post.webp' });
    expect(mockWriteFileSync).toHaveBeenCalledOnce();
    expect(mockWriteFileSync).toHaveBeenCalledWith('/output/thumbnails/post.webp', mockWebpBuffer);
  });

  it('outputPath 있어도 반환값은 webp Buffer이다', async () => {
    const result = await generateThumbnail({ title: 'With Output', outputPath: '/output/thumbnails/post.webp' });
    expect(result).toBe(mockWebpBuffer);
  });
});
