import type { LlmsPage, LlmsPost } from './llms';

import { afterEach, describe, expect, it, vi } from 'vitest';

const { getPosts, getPages } = vi.hoisted(() => ({
  getPosts: vi.fn<() => LlmsPost[]>(),
  getPages: vi.fn<() => LlmsPage[]>(),
}));

vi.mock('@/entities/post', () => ({ getPosts }));
vi.mock('@/entities/page', () => ({ getPages }));

/** SITE_URL은 모듈 로드 시 환경변수로 결정되므로 모듈을 새로 불러온다 */
async function loadLlms() {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://my-blog.com');
  return import('./llms');
}

function makePost(slug: string, overrides: Partial<LlmsPost> = {}): LlmsPost {
  return {
    title: `Title ${slug}`,
    description: `Description ${slug}`,
    path: `/posts/${slug}`,
    category: 'ai-tools',
    updatedAt: '2026-01-01T00:00:00.000Z',
    hub: false,
    ...overrides,
  };
}

function makePage(slug: string): LlmsPage {
  return { slug, title: `Page ${slug}`, description: `About ${slug}`, path: `/${slug}` };
}

/** `## {heading}` 절의 목록 줄 */
function sectionItems(text: string, heading: string): string[] {
  const body = text.split(`\n## ${heading}\n\n`)[1];
  if (body === undefined) return [];
  return body.split('\n\n## ')[0].trimEnd().split('\n');
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('escapeLinkText', () => {
  it('대괄호 이스케이프', async () => {
    const { escapeLinkText } = await loadLlms();

    expect(escapeLinkText('Fix [Error 5] fast')).toBe('Fix \\[Error 5\\] fast');
  });
});

describe('buildLlmsTxt', () => {
  it('H1 사이트 이름, blockquote 설명, 설명 문단 순서로 시작', async () => {
    const { buildLlmsTxt } = await loadLlms();
    const lines = buildLlmsTxt([], []).split('\n');

    expect(lines[0]).toBe('# ToolProof');
    expect(lines[1]).toBe('');
    expect(lines[2].startsWith('> ')).toBe(true);
    expect(lines[4]).toContain('hands-on test');
  });

  it('허브는 Start here, 나머지는 카테고리 절에 최근 변경 순, 글 없는 카테고리 절 생략', async () => {
    const { buildLlmsTxt } = await loadLlms();
    const text = buildLlmsTxt(
      [
        makePost('old', { updatedAt: '2026-01-01T00:00:00.000Z' }),
        makePost('new', { updatedAt: '2026-03-01T00:00:00.000Z' }),
        makePost('hub', { hub: true, category: 'software' }),
      ],
      [],
    );

    expect(sectionItems(text, 'Start here')).toEqual(['- [Title hub](https://my-blog.com/posts/hub): Description hub']);
    expect(sectionItems(text, 'AI Tools')).toEqual([
      '- [Title new](https://my-blog.com/posts/new): Description new',
      '- [Title old](https://my-blog.com/posts/old): Description old',
    ]);
    expect(text).not.toContain('## Apps & Software');
    expect(text).not.toContain('## News & Analysis');
  });

  it('소개·편집 원칙 페이지는 About, 나머지 정적 페이지는 Optional', async () => {
    const { buildLlmsTxt } = await loadLlms();
    const text = buildLlmsTxt([], [makePage('privacy'), makePage('about'), makePage('editorial-policy')]);

    expect(sectionItems(text, 'About')).toEqual([
      '- [Page about](https://my-blog.com/about): About about',
      '- [Page editorial-policy](https://my-blog.com/editorial-policy): About editorial-policy',
    ]);
    expect(sectionItems(text, 'Optional')).toEqual(['- [Page privacy](https://my-blog.com/privacy): About privacy']);
  });

  it('제목 대괄호 이스케이프, 설명 줄바꿈을 한 줄로, 파일 끝 줄바꿈', async () => {
    const { buildLlmsTxt } = await loadLlms();
    const text = buildLlmsTxt([makePost('a', { title: 'Fix [x]', description: 'Line one\n  line two' })], []);

    expect(text).toContain('- [Fix \\[x\\]](https://my-blog.com/posts/a): Line one line two');
    expect(text.endsWith('\n')).toBe(true);
  });
});

describe('GET /llms.txt', () => {
  it('정적 생성 설정 + text/plain으로 공개 글·페이지 안내 응답', async () => {
    getPosts.mockReturnValue([makePost('a')]);
    getPages.mockReturnValue([makePage('about')]);
    await loadLlms();
    const { GET, dynamic } = await import('./route');

    const response = GET();

    expect(dynamic).toBe('force-static');
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toContain('(https://my-blog.com/posts/a)');
  });
});
