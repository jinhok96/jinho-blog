import * as fs from 'fs';
import * as path from 'path';

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

import { MDX_ROUTES } from '../../config/index.js';
import { getRegistry } from './registry.js';

const mockExistsSync = vi.mocked(fs.existsSync);
const mockReadFileSync = vi.mocked(fs.readFileSync);

const REGISTRY_PATH = path.join(process.cwd(), 'public', '_static', 'registry.json');

const MOCK_REGISTRY = {
  blog: [{ slug: 'post-1', filePath: '/blog/post-1.mdx', path: '/blog/post-1' }],
  projects: [{ slug: 'proj-1', filePath: '/projects/proj-1.mdx', path: '/projects/proj-1' }],
  libraries: [],
};

beforeAll(() => {
  // console.warn, console.error 비활성화
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('getRegistry', () => {
  it('정상적으로 blog 섹션 반환', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(MOCK_REGISTRY) as never);

    const result = getRegistry('blog', MDX_ROUTES);
    expect(result).toEqual(MOCK_REGISTRY.blog);
  });

  it('정상적으로 projects 섹션 반환', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(MOCK_REGISTRY) as never);

    const result = getRegistry('projects', MDX_ROUTES);
    expect(result).toEqual(MOCK_REGISTRY.projects);
  });

  it('섹션에 항목이 없으면 빈 배열 반환', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(MOCK_REGISTRY) as never);

    const result = getRegistry('libraries', MDX_ROUTES);
    expect(result).toEqual([]);
  });

  it('registry.json이 없으면 에러 throw', () => {
    mockExistsSync.mockReturnValue(false);

    expect(() => getRegistry('blog', MDX_ROUTES)).toThrow(`Registry JSON not found at ${REGISTRY_PATH}`);
  });

  it('registry.json에 해당 섹션 키가 없으면 빈 배열 반환', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({ generatedAt: '2024-01-01' }) as never);

    const result = getRegistry('blog', MDX_ROUTES);
    expect(result).toEqual([]);
  });

  it('registry.json 읽기 시 올바른 경로 사용', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(MOCK_REGISTRY) as never);

    getRegistry('blog', MDX_ROUTES);

    expect(mockReadFileSync).toHaveBeenCalledWith(REGISTRY_PATH, 'utf-8');
  });
});
