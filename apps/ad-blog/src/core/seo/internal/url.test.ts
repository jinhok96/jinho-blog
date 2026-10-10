import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadUrl() {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://my-blog.com');
  return import('./url');
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('absoluteUrl', () => {
  it('홈은 끝 슬래시 없이 사이트 URL (Next.js canonical 렌더링과 동일)', async () => {
    const { absoluteUrl } = await loadUrl();

    expect(absoluteUrl('/')).toBe('https://my-blog.com');
    expect(absoluteUrl('')).toBe('https://my-blog.com');
  });

  it('사이트 경로 → 절대 URL (앞 슬래시 보정)', async () => {
    const { absoluteUrl } = await loadUrl();

    expect(absoluteUrl('/posts/hello')).toBe('https://my-blog.com/posts/hello');
    expect(absoluteUrl('posts/hello')).toBe('https://my-blog.com/posts/hello');
  });

  it('비ASCII 경로는 퍼센트 인코딩 (canonical·JSON-LD·sitemap 동일 URL)', async () => {
    const { absoluteUrl } = await loadUrl();

    expect(absoluteUrl('/posts/한글')).toBe('https://my-blog.com/posts/%ED%95%9C%EA%B8%80');
  });

  it('절대 URL은 그대로 반환 (이중 인코딩 없음)', async () => {
    const { absoluteUrl } = await loadUrl();

    expect(absoluteUrl('https://cdn.example.com/a%20b.png')).toBe('https://cdn.example.com/a%20b.png');
  });
});
