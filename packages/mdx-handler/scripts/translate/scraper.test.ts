import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { scrapeArticle } from './scraper.js';

const mockParse = vi.hoisted(() => vi.fn());
const mockTurndown = vi.hoisted(() => vi.fn().mockReturnValue('# Converted Markdown'));
const mockAddRule = vi.hoisted(() => vi.fn());

vi.mock('jsdom', () => ({
  JSDOM: vi.fn().mockImplementation(function (this: { window: object }) {
    this.window = { document: {} };
  }),
}));

vi.mock('@mozilla/readability', () => ({
  Readability: vi.fn().mockImplementation(function (this: { parse: unknown }) {
    this.parse = mockParse;
  }),
}));

vi.mock('turndown', () => ({
  default: vi.fn().mockImplementation(function (this: { addRule: unknown; turndown: unknown }) {
    this.addRule = mockAddRule;
    this.turndown = mockTurndown;
  }),
}));

const mockFetch = vi.fn();

describe('scrapeArticle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', mockFetch);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockTurndown.mockReturnValue('# Converted Markdown');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('정상 스크래핑 시 title과 markdown 반환', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => '<html><body><article><h1>Hello</h1></article></body></html>',
    });
    mockParse.mockReturnValue({ title: 'Hello', content: '<article><h1>Hello</h1></article>' });

    const result = await scrapeArticle('https://example.com/post');

    expect(result).not.toBeNull();
    expect(result!.title).toBe('Hello');
    expect(result!.markdown).toBe('# Converted Markdown');
  });

  it('fetch 응답이 ok=false면 null 반환', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    const result = await scrapeArticle('https://example.com/post');

    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('fetch 실패'));
  });

  it('Readability.parse()가 null을 반환하면 null 반환', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => '<html><body></body></html>',
    });
    mockParse.mockReturnValue(null);

    const result = await scrapeArticle('https://example.com/post');

    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('본문 추출 실패'));
  });

  it('AbortError 발생 시 타임아웃 경고와 null 반환', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    mockFetch.mockRejectedValue(abortError);

    const result = await scrapeArticle('https://example.com/post');

    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('스크래핑 타임아웃'));
  });

  it('일반 fetch 오류 발생 시 null 반환', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const result = await scrapeArticle('https://example.com/post');

    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('스크래핑 오류'), expect.any(Error));
  });

  it('article.content가 없어도 빈 문자열로 처리', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => '<html></html>',
    });
    mockParse.mockReturnValue({ title: 'Test', content: null });

    const result = await scrapeArticle('https://example.com/post');

    expect(result).not.toBeNull();
  });

  it('article.title이 없으면 빈 문자열', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => '<html></html>',
    });
    mockParse.mockReturnValue({ title: null, content: '<p>Content</p>' });

    const result = await scrapeArticle('https://example.com/post');

    expect(result!.title).toBe('');
  });

  it('addRule에 등록된 codeBlock replacement 함수 — 언어 클래스 있는 경우', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => '<html></html>',
    });
    mockParse.mockReturnValue({ title: 'Test', content: '<p>Content</p>' });

    await scrapeArticle('https://example.com/post');

    // addRule이 호출됐는지 확인하고 콜백 직접 실행
    expect(mockAddRule).toHaveBeenCalledWith('codeBlock', expect.objectContaining({ replacement: expect.any(Function) }));

    const [, options] = mockAddRule.mock.calls[0] as [string, { replacement: (c: string, n: unknown) => string }];
    const codeNodeWithLang = {
      className: 'language-typescript',
      textContent: 'const x = 1;',
    };
    const nodeWithCode = { querySelector: () => codeNodeWithLang };
    const result = options.replacement('fallback', nodeWithCode);
    expect(result).toContain('```typescript');
    expect(result).toContain('const x = 1;');
  });

  it('addRule codeBlock replacement — 언어 클래스 없는 경우', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => '<html></html>',
    });
    mockParse.mockReturnValue({ title: 'Test', content: '<p>Content</p>' });

    await scrapeArticle('https://example.com/post');

    const [, options] = mockAddRule.mock.calls[0] as [string, { replacement: (c: string, n: unknown) => string }];
    const codeNodeNoLang = { className: '', textContent: 'code here' };
    const nodeWithCode = { querySelector: () => codeNodeNoLang };
    const result = options.replacement('fallback', nodeWithCode);
    expect(result).toContain('```\n');
    expect(result).toContain('code here');
  });

  it('addRule codeBlock replacement — code 노드 없는 경우 fallback content 사용', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => '<html></html>',
    });
    mockParse.mockReturnValue({ title: 'Test', content: '<p>Content</p>' });

    await scrapeArticle('https://example.com/post');

    const [, options] = mockAddRule.mock.calls[0] as [string, { replacement: (c: string, n: unknown) => string }];
    const nodeWithoutCode = { querySelector: () => null };
    const result = options.replacement('fallback content', nodeWithoutCode);
    expect(result).toContain('fallback content');
  });
});
