import * as fs from 'fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

import { resolveContentPaths } from '@jinho-blog/mdx-handler/build';

import { contentConfig } from './config';
import { contentReader } from './reader';

const mockReadFileSync = vi.mocked(fs.readFileSync);

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('contentReader', () => {
  it('빌드 파이프라인이 기록하는 registry.json 경로(contentConfig.registryFile)를 읽음', () => {
    mockReadFileSync.mockReturnValue(JSON.stringify({ posts: [] }));

    contentReader.getEntries('posts');

    expect(mockReadFileSync).toHaveBeenCalledWith(resolveContentPaths(contentConfig).registryFile, 'utf-8');
  });

  it('레지스트리는 public 밖에 생성 (정적 export 시 원문 노출 방지)', () => {
    const { registryFile } = resolveContentPaths(contentConfig);

    expect(registryFile).not.toContain(`${process.cwd()}/public`);
  });

  it('컬렉션 항목 반환', () => {
    const entries = [{ slug: 'post-1', title: 'Post 1' }];
    mockReadFileSync.mockReturnValue(JSON.stringify({ posts: entries, pages: [] }));

    expect(contentReader.getEntries('posts')).toEqual(entries);
    expect(contentReader.getEntries('pages')).toEqual([]);
  });
});
