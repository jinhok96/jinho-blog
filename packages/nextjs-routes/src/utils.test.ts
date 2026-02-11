import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(),
}));

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { findFiles, getAppDirectory, getPagesDirectory, isNotUndefined } from './utils.js';

const mockExistsSync = vi.mocked(existsSync);
const mockReaddirSync = vi.mocked(readdirSync);
const mockStatSync = vi.mocked(statSync);

beforeEach(() => {
  vi.clearAllMocks();
  mockExistsSync.mockReturnValue(false);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getPagesDirectory', () => {
  it('최상위 pages/ 디렉토리를 찾는다', () => {
    mockExistsSync.mockImplementation(p => p === join('/my-dir', 'pages'));
    expect(getPagesDirectory('/my-dir')).toBe(join('/my-dir', 'pages'));
  });

  it('src/pages/ 디렉토리를 찾는다', () => {
    mockExistsSync.mockImplementation(p => p === join('/my-dir', 'src', 'pages'));
    expect(getPagesDirectory('/my-dir')).toBe(join('/my-dir', 'src', 'pages'));
  });

  it('pages 디렉토리가 없으면 undefined를 반환한다', () => {
    mockExistsSync.mockReturnValue(false);
    expect(getPagesDirectory('/my-dir')).toBeUndefined();
  });

  it('최상위 pages/를 src/pages/ 보다 먼저 찾는다', () => {
    mockExistsSync.mockReturnValue(true);
    expect(getPagesDirectory('/my-dir')).toBe(join('/my-dir', 'pages'));
  });
});

describe('getAppDirectory', () => {
  it('최상위 app/ 디렉토리를 찾는다', () => {
    mockExistsSync.mockImplementation(p => p === join('/my-dir', 'app'));
    expect(getAppDirectory('/my-dir')).toBe(join('/my-dir', 'app'));
  });

  it('src/app/ 디렉토리를 찾는다', () => {
    mockExistsSync.mockImplementation(p => p === join('/my-dir', 'src', 'app'));
    expect(getAppDirectory('/my-dir')).toBe(join('/my-dir', 'src', 'app'));
  });

  it('app 디렉토리가 없으면 undefined를 반환한다', () => {
    mockExistsSync.mockReturnValue(false);
    expect(getAppDirectory('/my-dir')).toBeUndefined();
  });

  it('최상위 app/를 src/app/ 보다 먼저 찾는다', () => {
    mockExistsSync.mockReturnValue(true);
    expect(getAppDirectory('/my-dir')).toBe(join('/my-dir', 'app'));
  });
});

describe('findFiles', () => {
  it('빈 디렉토리는 빈 배열을 반환한다', () => {
    mockReaddirSync.mockReturnValue([] as never);
    expect(findFiles('/root')).toEqual([]);
  });

  it('파일 목록을 반환한다', () => {
    mockReaddirSync.mockReturnValue(['page.tsx', 'layout.tsx'] as never);
    mockStatSync.mockReturnValue({ isDirectory: () => false } as never);

    const result = findFiles('/root');
    expect(result).toEqual([join('/root', 'page.tsx'), join('/root', 'layout.tsx')]);
  });

  it('디렉토리를 재귀적으로 탐색한다', () => {
    mockReaddirSync.mockImplementation((dir: unknown) => {
      if (dir === '/root') return ['blog'] as never;
      if (dir === join('/root', 'blog')) return ['page.tsx'] as never;
      return [] as never;
    });
    mockStatSync.mockImplementation(
      (p: unknown) => ({ isDirectory: () => p === join('/root', 'blog') }) as never,
    );

    const result = findFiles('/root');
    expect(result).toEqual([join('/root', 'blog', 'page.tsx')]);
  });

  it('node_modules 경로를 제외한다', () => {
    mockReaddirSync.mockReturnValue(['node_modules', 'page.tsx'] as never);
    mockStatSync.mockImplementation(
      (p: unknown) => ({ isDirectory: () => String(p).includes('node_modules') }) as never,
    );

    const result = findFiles('/root');
    expect(result).toEqual([join('/root', 'page.tsx')]);
  });
});

describe('isNotUndefined', () => {
  it('undefined이면 false를 반환한다', () => {
    expect(isNotUndefined(undefined)).toBe(false);
  });

  it('null이면 true를 반환한다', () => {
    expect(isNotUndefined(null)).toBe(true);
  });

  it('문자열이면 true를 반환한다', () => {
    expect(isNotUndefined('hello')).toBe(true);
  });

  it('0이면 true를 반환한다', () => {
    expect(isNotUndefined(0)).toBe(true);
  });

  it('false이면 true를 반환한다', () => {
    expect(isNotUndefined(false)).toBe(true);
  });

  it('빈 문자열이면 true를 반환한다', () => {
    expect(isNotUndefined('')).toBe(true);
  });
});
