import { afterEach, describe, expect, it, vi } from 'vitest';

/** SITE_URL은 모듈 로드 시 환경변수로 결정되므로 환경별로 모듈을 새로 불러온다 */
async function loadMetadata(siteUrl?: string) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', siteUrl ?? '');
  return import('./metadata');
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('buildMetadata', () => {
  it('canonical·og:url은 절대 URL (홈은 끝 슬래시 포함)', async () => {
    const { buildMetadata } = await loadMetadata('https://my-blog.com/');

    const home = buildMetadata({ path: '/' });
    const post = buildMetadata({ path: '/posts/hello' });

    expect(home.alternates?.canonical).toBe('https://my-blog.com/');
    expect(post.alternates?.canonical).toBe('https://my-blog.com/posts/hello');
    expect(post.openGraph?.url).toBe('https://my-blog.com/posts/hello');
  });

  it('제목: 지정 시 템플릿 적용 문자열, 미지정·absoluteTitle이면 템플릿 무시', async () => {
    const { buildMetadata } = await loadMetadata('https://my-blog.com');

    expect(buildMetadata({ path: '/a', title: '글 제목' }).title).toBe('글 제목');
    expect(buildMetadata({ path: '/' }).title).toEqual({ absolute: '블로그 이름' });
    expect(buildMetadata({ path: '/', title: '홈 제목', absoluteTitle: true }).title).toEqual({ absolute: '홈 제목' });
  });

  it('도메인 설정 시 색인 허용, noindex 지정 시 색인 제외', async () => {
    const { buildMetadata } = await loadMetadata('https://my-blog.com');

    expect(buildMetadata({ path: '/' }).robots).toMatchObject({ index: true, follow: true });
    expect(buildMetadata({ path: '/', noindex: true }).robots).toEqual({ index: false, follow: true });
  });

  it('도메인 미설정(placeholder) 상태에서는 모든 페이지 noindex', async () => {
    const { buildMetadata } = await loadMetadata();

    expect(buildMetadata({ path: '/' }).robots).toEqual({ index: false, follow: true });
    expect(buildMetadata({ path: '/' }).alternates?.canonical).toBe('https://example.com/');
  });

  it('OG 이미지: 기본 이미지는 크기 포함, 사이트 경로는 절대 URL로 변환', async () => {
    const { buildMetadata } = await loadMetadata('https://my-blog.com');

    expect(buildMetadata({ path: '/' }).openGraph?.images).toEqual([
      { url: 'https://my-blog.com/_static/og-default.jpg', alt: '블로그 이름', width: 1200, height: 630 },
    ]);
    expect(
      buildMetadata({ path: '/a', title: 'A', image: { url: 'https://cdn.example.com/a.png' } }).openGraph?.images,
    ).toEqual([{ url: 'https://cdn.example.com/a.png', alt: 'A', width: undefined, height: undefined }]);
  });

  it('article: 발행·수정일과 작성자 포함', async () => {
    const { buildMetadata } = await loadMetadata('https://my-blog.com');

    const metadata = buildMetadata({
      path: '/posts/a',
      title: 'A',
      type: 'article',
      publishedTime: '2026-01-01T00:00:00.000Z',
      modifiedTime: '2026-01-02T00:00:00.000Z',
    });

    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-01-01T00:00:00.000Z',
      modifiedTime: '2026-01-02T00:00:00.000Z',
      authors: ['작성자'],
    });
  });

  it('RSS 피드 링크 포함, 키워드는 있을 때만 포함', async () => {
    const { buildMetadata } = await loadMetadata('https://my-blog.com');

    const withKeywords = buildMetadata({ path: '/a', keywords: ['키워드', '키워드'] });

    expect(withKeywords.alternates?.types).toEqual({ 'application/rss+xml': 'https://my-blog.com/rss.xml' });
    expect(withKeywords.keywords).toEqual(['키워드']);
    expect(buildMetadata({ path: '/a' })).not.toHaveProperty('keywords');
  });
});

describe('selectOgImage', () => {
  it('ogImage → thumbnail → 기본 이미지 순으로 선택', async () => {
    const { selectOgImage, DEFAULT_OG } = await loadMetadata('https://my-blog.com');

    expect(selectOgImage({ ogImage: '/og.jpg', thumbnail: '/t.webp' })).toEqual({
      url: '/og.jpg',
      width: 1200,
      height: 630,
    });
    expect(selectOgImage({ thumbnail: '/t.webp' })).toEqual({ url: '/t.webp' });
    expect(selectOgImage({})).toBe(DEFAULT_OG);
  });
});
