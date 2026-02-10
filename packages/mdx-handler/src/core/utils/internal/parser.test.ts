import * as fs from 'fs';

import matter from 'gray-matter';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

vi.mock('gray-matter', () => ({
  default: vi.fn(),
}));

import { parseMdxFile } from './parser.js';

const mockReadFileSync = vi.mocked(fs.readFileSync);
const mockMatter = vi.mocked(matter);

beforeAll(() => {
  // console.warn, console.error 비활성화
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
  mockReadFileSync.mockReturnValue('raw file content');
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('parseMdxFile', () => {
  describe('이미지 경로 변환 (transformImagePaths)', () => {
    it('blog 섹션: ./images/test.webp → /_next/static/media/mdx/blog/images/test.webp', () => {
      mockMatter.mockReturnValue({ content: '![alt](./images/test.webp)', data: {} } as never);
      const result = parseMdxFile('/project/content/mdx/blog/post.mdx');
      expect(result.content).toBe('![alt](/_next/static/media/mdx/blog/images/test.webp)');
    });

    it('projects 섹션: 경로 변환', () => {
      mockMatter.mockReturnValue({ content: '![img](./images/shot.png)', data: {} } as never);
      const result = parseMdxFile('/project/content/mdx/projects/my-project.mdx');
      expect(result.content).toBe('![img](/_next/static/media/mdx/projects/images/shot.png)');
    });

    it('libraries 섹션: 경로 변환', () => {
      mockMatter.mockReturnValue({ content: '![icon](./images/logo.svg)', data: {} } as never);
      const result = parseMdxFile('/project/content/mdx/libraries/react.mdx');
      expect(result.content).toBe('![icon](/_next/static/media/mdx/libraries/images/logo.svg)');
    });

    it('content/mdx 외 경로: 변환 없이 원본 반환', () => {
      mockMatter.mockReturnValue({ content: '![alt](./images/test.webp)', data: {} } as never);
      const result = parseMdxFile('/some/other/path/file.mdx');
      expect(result.content).toBe('![alt](./images/test.webp)');
    });

    it('이미지가 없는 콘텐츠: 그대로 반환', () => {
      mockMatter.mockReturnValue({ content: '# Hello World\n\nsome text', data: {} } as never);
      const result = parseMdxFile('/project/content/mdx/blog/post.mdx');
      expect(result.content).toBe('# Hello World\n\nsome text');
    });

    it('콘텐츠에 이미지 여러 개: 모두 변환', () => {
      mockMatter.mockReturnValue({
        content: '![a](./a.png) and ![b](./b.png)',
        data: {},
      } as never);
      const result = parseMdxFile('/project/content/mdx/blog/post.mdx');
      expect(result.content).toBe(
        '![a](/_next/static/media/mdx/blog/a.png) and ![b](/_next/static/media/mdx/blog/b.png)',
      );
    });
  });

  describe('extractSection (경로에서 섹션 추출)', () => {
    it('Windows 스타일 경로도 인식', () => {
      mockMatter.mockReturnValue({ content: '![alt](./img.png)', data: {} } as never);
      const result = parseMdxFile('C:\\project\\content\\mdx\\blog\\post.mdx');
      expect(result.content).toBe('![alt](/_next/static/media/mdx/blog/img.png)');
    });
  });

  describe('fs.readFileSync 호출', () => {
    it('filePath로 파일을 utf-8로 읽음', () => {
      mockMatter.mockReturnValue({ content: '', data: {} } as never);
      parseMdxFile('/any/path.mdx');
      expect(mockReadFileSync).toHaveBeenCalledWith('/any/path.mdx', 'utf-8');
    });
  });
});
