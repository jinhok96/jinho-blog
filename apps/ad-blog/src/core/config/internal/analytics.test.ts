import { describe, expect, it } from 'vitest';

import { CF_WEB_ANALYTICS_TOKEN, validateAnalyticsConfig } from './analytics';

describe('validateAnalyticsConfig', () => {
  it('현재 설정은 유효 (빌드 시 모듈 로드에서 검증됨)', () => {
    expect(() => validateAnalyticsConfig(CF_WEB_ANALYTICS_TOKEN)).not.toThrow();
  });

  it('미설정(빈 값)은 허용', () => {
    expect(() => validateAnalyticsConfig('')).not.toThrow();
  });

  it('32자리 16진수 토큰 통과', () => {
    expect(() => validateAnalyticsConfig('0123456789abcdef0123456789ABCDEF')).not.toThrow();
  });

  it.each(['abc', '0123456789abcdef0123456789abcdeg', '{"token": "x"}'])('형식 오류: %s', token => {
    expect(() => validateAnalyticsConfig(token)).toThrow('CF_WEB_ANALYTICS_TOKEN 형식 오류');
  });
});
