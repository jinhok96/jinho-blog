import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it } from 'vitest';

import { contentConfig } from '../../src/core/content';

type VercelRedirect = { source: string; destination: string; permanent?: boolean };

const APP_ROOT = path.resolve(__dirname, '../..');
const POSTS_PREFIX = `${contentConfig.collections.posts.route}/`;

/** 단일 경로 세그먼트 slug (하위 경로·끝 슬래시·`.html` 확장자 없음 = 정적 export 배포 URL) */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const { redirects = [] } = JSON.parse(fs.readFileSync(path.join(APP_ROOT, 'vercel.json'), 'utf-8')) as {
  redirects?: VercelRedirect[];
};

/** `/posts/{slug}` → slug (글 경로가 아니면 null) */
function toPostSlug(urlPath: string): string | null {
  if (!urlPath.startsWith(POSTS_PREFIX)) return null;

  const slug = urlPath.slice(POSTS_PREFIX.length);
  return SLUG_PATTERN.test(slug) ? slug : null;
}

/** `content/posts/{slug}.mdx` 존재 여부 */
function hasPostFile(slug: string): boolean {
  return fs.existsSync(path.join(APP_ROOT, contentConfig.contentDir, 'posts', `${slug}.mdx`));
}

describe('vercel.json redirects', () => {
  it('원본·대상 모두 /posts/{slug} 경로', () => {
    for (const { source, destination } of redirects) {
      expect(toPostSlug(source), source).not.toBeNull();
      expect(toPostSlug(destination), destination).not.toBeNull();
    }
  });

  it('원본 글 파일이 없음 (발행 중인 글은 리다이렉트 금지)', () => {
    for (const { source } of redirects) {
      const slug = toPostSlug(source);
      expect(slug !== null && hasPostFile(slug), source).toBe(false);
    }
  });

  it('대상 글 파일이 있음', () => {
    for (const { destination } of redirects) {
      const slug = toPostSlug(destination);
      expect(slug !== null && hasPostFile(slug), destination).toBe(true);
    }
  });

  it('영구 리다이렉트 (permanent: true → 308)', () => {
    for (const { source, permanent } of redirects) {
      expect(permanent, source).toBe(true);
    }
  });

  it('원본 중복 없음', () => {
    const sources = redirects.map(({ source }) => source);
    expect(new Set(sources).size).toBe(sources.length);
  });

  it('대상이 다른 리다이렉트의 원본이 아님 (체인 금지)', () => {
    const sources = new Set(redirects.map(({ source }) => source));

    for (const { source, destination } of redirects) {
      expect(sources.has(destination), `${source} → ${destination}`).toBe(false);
    }
  });
});
