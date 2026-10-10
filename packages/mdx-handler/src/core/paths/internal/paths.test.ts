import * as path from 'path';

import { describe, expect, it } from 'vitest';

import { resolveContentPaths } from './paths.js';

describe('resolveContentPaths', () => {
  const root = path.resolve('/repo/apps/web');
  const paths = resolveContentPaths(
    { contentDir: '../../content/mdx', staticDir: 'public/_static', staticUrl: '/_static/' },
    root,
  );

  it('컬렉션 디렉토리: contentDir/{name}', () => {
    expect(paths.collectionDir('blog')).toBe(path.resolve('/repo/content/mdx/blog'));
  });

  it('레지스트리: staticDir/registry.json', () => {
    expect(paths.registryFile).toBe(path.resolve('/repo/apps/web/public/_static/registry.json'));
  });

  it('미디어 루트: staticDir/mdx, staticUrl/mdx (끝 슬래시 제거)', () => {
    expect(paths.mediaRootDir).toBe(path.resolve('/repo/apps/web/public/_static/mdx'));
    expect(paths.mediaRootUrl).toBe('/_static/mdx');
  });

  it('컬렉션 미디어: 미디어 루트/{name}', () => {
    expect(paths.mediaDir('blog')).toBe(path.resolve('/repo/apps/web/public/_static/mdx/blog'));
    expect(paths.mediaUrl('blog')).toBe('/_static/mdx/blog');
  });

  it('rootDir 생략 시 process.cwd() 기준', () => {
    const cwdPaths = resolveContentPaths({ contentDir: 'content', staticDir: 'public', staticUrl: '/' });

    expect(cwdPaths.registryFile).toBe(path.join(process.cwd(), 'public', 'registry.json'));
    expect(cwdPaths.mediaUrl('blog')).toBe('/mdx/blog');
  });
});
