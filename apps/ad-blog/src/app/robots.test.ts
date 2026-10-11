import { afterEach, describe, expect, it, vi } from 'vitest';

/** SITE_INDEXABLE은 모듈 로드 시 환경변수로 결정되므로 환경별로 모듈을 새로 불러온다 */
async function loadRobots(siteUrl?: string) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', siteUrl ?? '');
  return import('./robots');
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('robots', () => {
  it('도메인 설정 시 전체 허용 + sitemap 절대 URL', async () => {
    const { default: robots } = await loadRobots('https://my-blog.com');

    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://my-blog.com/sitemap.xml',
    });
  });

  it('도메인 미설정(placeholder) 상태에서는 전체 크롤링 차단, sitemap 미노출', async () => {
    const { default: robots } = await loadRobots();

    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });

  it('정적 export용 force-static 설정', async () => {
    const { dynamic } = await loadRobots();

    expect(dynamic).toBe('force-static');
  });
});
