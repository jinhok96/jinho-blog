import { describe, expect, it } from 'vitest';

import { getBeaconConfig, shouldLoadAnalytics } from './cloudflare';

const TOKEN = '0123456789abcdef0123456789abcdef';
const SITE = 'https://tool-proof.com';
const base = { isDevelopment: false, token: TOKEN, hostname: 'tool-proof.com', siteUrl: SITE };

describe('shouldLoadAnalytics', () => {
  it('사이트 도메인에서 토큰이 있으면 로드', () => {
    expect(shouldLoadAnalytics(base)).toBe(true);
  });

  it('www 유무는 같은 사이트로 봄', () => {
    expect(shouldLoadAnalytics({ ...base, hostname: 'www.tool-proof.com' })).toBe(true);
    expect(shouldLoadAnalytics({ ...base, siteUrl: 'https://www.tool-proof.com' })).toBe(true);
  });

  it('개발 서버·토큰 없음은 로드 안 함', () => {
    expect(shouldLoadAnalytics({ ...base, isDevelopment: true })).toBe(false);
    expect(shouldLoadAnalytics({ ...base, token: '' })).toBe(false);
  });

  it('미리보기 배포·로컬 등 다른 호스트는 로드 안 함', () => {
    expect(shouldLoadAnalytics({ ...base, hostname: 'ad-blog-git-dev-team.vercel.app' })).toBe(false);
    expect(shouldLoadAnalytics({ ...base, hostname: 'localhost' })).toBe(false);
    expect(shouldLoadAnalytics({ ...base, siteUrl: 'https://example.com' })).toBe(false);
  });
});

describe('getBeaconConfig', () => {
  it('data-cf-beacon 속성 JSON', () => {
    expect(JSON.parse(getBeaconConfig(TOKEN))).toEqual({ token: TOKEN });
  });
});
