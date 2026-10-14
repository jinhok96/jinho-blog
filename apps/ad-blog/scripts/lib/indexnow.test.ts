import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it, vi } from 'vitest';

import { contentConfig } from '../../src/core/content';
import {
  buildPayloads,
  contentFileToPath,
  findPreviousDeploymentSha,
  INDEXNOW_KEY,
  INDEXNOW_MAX_URLS,
  parseNameStatus,
  parseSitemapUrls,
  selectUrls,
} from './indexnow';

describe('INDEXNOW_KEY', () => {
  it('IndexNow 키 형식 (8~128자, 영문·숫자·하이픈)', () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-zA-Z0-9-]{8,128}$/);
  });

  it('public/{키}.txt 내용이 키와 일치', () => {
    const keyFile = path.resolve(__dirname, '../../public', `${INDEXNOW_KEY}.txt`);
    expect(fs.readFileSync(keyFile, 'utf-8').trim()).toBe(INDEXNOW_KEY);
  });
});

describe('parseNameStatus', () => {
  it('추가·수정·타입 변경은 updated, 삭제는 deleted', () => {
    const output = [
      'A',
      'content/posts/a.mdx',
      'M',
      'content/posts/b.mdx',
      'T',
      'content/posts/c.mdx',
      'D',
      'content/posts/d.mdx',
      '',
    ].join('\0');

    expect(parseNameStatus(output)).toEqual([
      { file: 'content/posts/a.mdx', type: 'updated' },
      { file: 'content/posts/b.mdx', type: 'updated' },
      { file: 'content/posts/c.mdx', type: 'updated' },
      { file: 'content/posts/d.mdx', type: 'deleted' },
    ]);
  });

  it('이름 변경은 이전 경로 삭제 + 새 경로 수정, 복사는 새 경로 수정', () => {
    const output = [
      'R087',
      'content/posts/old.mdx',
      'content/posts/new.mdx',
      'C100',
      'content/posts/a.mdx',
      'content/posts/b.mdx',
      '',
    ].join('\0');

    expect(parseNameStatus(output)).toEqual([
      { file: 'content/posts/old.mdx', type: 'deleted' },
      { file: 'content/posts/new.mdx', type: 'updated' },
      { file: 'content/posts/b.mdx', type: 'updated' },
    ]);
  });

  it('공백·특수문자가 있는 경로도 그대로 유지 (-z 출력은 따옴표 처리 없음)', () => {
    expect(parseNameStatus('M\0content/posts/a "b".mdx\0')).toEqual([
      { file: 'content/posts/a "b".mdx', type: 'updated' },
    ]);
  });

  it('변경이 없으면 빈 배열', () => {
    expect(parseNameStatus('')).toEqual([]);
  });
});

describe('contentFileToPath', () => {
  it('글은 /posts/{slug}', () => {
    expect(contentFileToPath('content/posts/turn-off-ai-in-chrome.mdx', contentConfig)).toBe(
      '/posts/turn-off-ai-in-chrome',
    );
  });

  it('정적 페이지는 루트 경로 /{slug}', () => {
    expect(contentFileToPath('content/pages/about.mdx', contentConfig)).toBe('/about');
  });

  it('contentDir이 ./로 시작해도 같은 결과', () => {
    expect(contentFileToPath('content/posts/a.mdx', { ...contentConfig, contentDir: './content' })).toBe('/posts/a');
  });

  it.each([
    ['MDX가 아닌 파일', 'content/posts/image.png'],
    ['컬렉션 하위 디렉토리 (레지스트리 대상 아님)', 'content/posts/assets/a.mdx'],
    ['컬렉션이 아닌 디렉토리', 'content/drafts/a.mdx'],
    ['Object 프로토타입 키', 'content/constructor/a.mdx'],
    ['contentDir 바로 아래 파일', 'content/a.mdx'],
    ['contentDir 밖', 'src/app/a.mdx'],
  ])('%s → null', (_, file) => {
    expect(contentFileToPath(file, contentConfig)).toBeNull();
  });
});

describe('parseSitemapUrls', () => {
  it('<loc> 값을 순서대로 추출하고 XML 엔티티 복원', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://tool-proof.com</loc>
<lastmod>2026-10-11T00:00:00.000Z</lastmod>
</url>
<url>
<loc>
  https://tool-proof.com/posts/a?x=1&amp;y=&lt;2&gt;
</loc>
</url>
</urlset>`;

    expect(parseSitemapUrls(xml)).toEqual(['https://tool-proof.com', 'https://tool-proof.com/posts/a?x=1&y=<2>']);
  });

  it('<loc>가 없으면 빈 배열', () => {
    expect(parseSitemapUrls('<urlset></urlset>')).toEqual([]);
  });
});

describe('selectUrls', () => {
  const SITEMAP = new Set(['https://a.com/posts/live', 'https://a.com/posts/stale']);

  it('수정된 URL은 sitemap에 있으면 제출, 없으면 missing', () => {
    expect(
      selectUrls(
        [
          { url: 'https://a.com/posts/live', type: 'updated' },
          { url: 'https://a.com/posts/draft', type: 'updated' },
        ],
        SITEMAP,
      ),
    ).toEqual({ submit: ['https://a.com/posts/live'], missing: ['https://a.com/posts/draft'] });
  });

  it('삭제된 URL은 sitemap에서 빠졌을 때만 제출', () => {
    expect(
      selectUrls(
        [
          { url: 'https://a.com/posts/gone', type: 'deleted' },
          { url: 'https://a.com/posts/stale', type: 'deleted' },
        ],
        SITEMAP,
      ),
    ).toEqual({ submit: ['https://a.com/posts/gone'], missing: [] });
  });

  it('같은 URL이 삭제·수정 모두면 수정으로 처리하고 중복 제거', () => {
    expect(
      selectUrls(
        [
          { url: 'https://a.com/posts/live', type: 'updated' },
          { url: 'https://a.com/posts/live', type: 'deleted' },
          { url: 'https://a.com/posts/live', type: 'updated' },
        ],
        SITEMAP,
      ),
    ).toEqual({ submit: ['https://a.com/posts/live'], missing: [] });
  });
});

describe('findPreviousDeploymentSha', () => {
  const ENVIRONMENT = 'Production – ad-blog';

  function mockRequest(deployments: { id: number; sha: string }[], statuses: Record<number, string[]>) {
    return vi.fn(async (apiPath: string) => {
      if (apiPath.startsWith('/deployments?')) return deployments;
      const id = Number(apiPath.match(/^\/deployments\/(\d+)\/statuses/)?.[1]);
      return (statuses[id] ?? []).map(state => ({ state }));
    });
  }

  it('현재 배포보다 이전 배포 중 성공 이력이 있는 첫 배포의 sha (이후 inactive로 바뀐 배포 포함)', async () => {
    const request = mockRequest(
      [
        { id: 40, sha: 'newer' },
        { id: 30, sha: 'current' },
        { id: 20, sha: 'failed' },
        { id: 10, sha: 'previous' },
        { id: 5, sha: 'older' },
      ],
      { 20: ['failure', 'pending'], 10: ['inactive', 'success', 'pending'], 5: ['success'] },
    );

    await expect(findPreviousDeploymentSha({ deploymentId: 30, environment: ENVIRONMENT, request })).resolves.toBe(
      'previous',
    );
    expect(request).toHaveBeenCalledWith(`/deployments?environment=${encodeURIComponent(ENVIRONMENT)}&per_page=30`);
    expect(request).not.toHaveBeenCalledWith(expect.stringMatching(/^\/deployments\/(40|30|5)\//));
  });

  it('성공한 이전 배포가 없으면 null', async () => {
    const request = mockRequest(
      [
        { id: 30, sha: 'current' },
        { id: 20, sha: 'failed' },
      ],
      { 20: ['error'] },
    );

    await expect(
      findPreviousDeploymentSha({ deploymentId: 30, environment: ENVIRONMENT, request }),
    ).resolves.toBeNull();
  });
});

describe('buildPayloads', () => {
  it('호스트·키·키 파일 위치 포함', () => {
    expect(buildPayloads('https://tool-proof.com', ['https://tool-proof.com/posts/a'])).toEqual([
      {
        host: 'tool-proof.com',
        key: INDEXNOW_KEY,
        keyLocation: `https://tool-proof.com/${INDEXNOW_KEY}.txt`,
        urlList: ['https://tool-proof.com/posts/a'],
      },
    ]);
  });

  it('요청당 최대 URL 수를 넘으면 분할', () => {
    const urls = Array.from({ length: INDEXNOW_MAX_URLS + 1 }, (_, i) => `https://a.com/${i}`);
    const payloads = buildPayloads('https://a.com', urls);

    expect(payloads.map(({ urlList }) => urlList.length)).toEqual([INDEXNOW_MAX_URLS, 1]);
    expect(payloads.flatMap(({ urlList }) => urlList)).toEqual(urls);
  });

  it('URL이 없으면 요청 없음', () => {
    expect(buildPayloads('https://a.com', [])).toEqual([]);
  });
});
