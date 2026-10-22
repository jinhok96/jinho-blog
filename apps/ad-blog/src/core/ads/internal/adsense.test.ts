import { describe, expect, it } from 'vitest';

import {
  buildAdsTxt,
  getAdsenseScriptSrc,
  getAdSlotAttributes,
  resolveAdSlotState,
  shouldLoadAdsense,
} from './adsense';

const CLIENT = 'ca-pub-1234567890123456';

describe('resolveAdSlotState', () => {
  it('개발 서버는 ID 설정과 무관하게 자리표시 상자 (실제 광고 요청 안 함)', () => {
    expect(resolveAdSlotState({ isDevelopment: true, client: CLIENT, slotId: '1' })).toBe('placeholder');
    expect(resolveAdSlotState({ isDevelopment: true, client: '', slotId: '' })).toBe('placeholder');
  });

  it('게시자 ID와 광고 단위 ID가 모두 있으면 실제 광고', () => {
    expect(resolveAdSlotState({ isDevelopment: false, client: CLIENT, slotId: '1' })).toBe('live');
  });

  it('하나라도 없으면 렌더링 안 함', () => {
    expect(resolveAdSlotState({ isDevelopment: false, client: '', slotId: '1' })).toBe('hidden');
    expect(resolveAdSlotState({ isDevelopment: false, client: CLIENT, slotId: '' })).toBe('hidden');
  });
});

describe('shouldLoadAdsense', () => {
  it('개발 서버가 아니고 게시자 ID가 있을 때만 로드', () => {
    expect(shouldLoadAdsense({ isDevelopment: false, client: CLIENT, isExcludedPage: false })).toBe(true);
    expect(shouldLoadAdsense({ isDevelopment: true, client: CLIENT, isExcludedPage: false })).toBe(false);
    expect(shouldLoadAdsense({ isDevelopment: false, client: '', isExcludedPage: false })).toBe(false);
  });

  it('광고 제외 페이지(404·정적 페이지)는 로드하지 않음 (자동 광고 차단)', () => {
    expect(shouldLoadAdsense({ isDevelopment: false, client: CLIENT, isExcludedPage: true })).toBe(false);
  });
});

describe('getAdsenseScriptSrc', () => {
  it('게시자 ID를 client 쿼리로 포함', () => {
    expect(getAdsenseScriptSrc(CLIENT)).toBe(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456',
    );
  });
});

describe('getAdSlotAttributes', () => {
  it('display: 반응형 자동 크기', () => {
    expect(getAdSlotAttributes(CLIENT, { slotId: '111', layout: 'display' })).toEqual({
      'data-ad-client': CLIENT,
      'data-ad-slot': '111',
      'data-ad-format': 'auto',
      'data-full-width-responsive': 'true',
    });
  });

  it('in-article: fluid + in-article 레이아웃', () => {
    expect(getAdSlotAttributes(CLIENT, { slotId: '222', layout: 'in-article' })).toEqual({
      'data-ad-client': CLIENT,
      'data-ad-slot': '222',
      'data-ad-format': 'fluid',
      'data-ad-layout': 'in-article',
    });
  });

  it('in-feed: fluid + layoutKey', () => {
    expect(getAdSlotAttributes(CLIENT, { slotId: '333', layout: 'in-feed', layoutKey: '-6t+ed+2i-1n-4w' })).toEqual({
      'data-ad-client': CLIENT,
      'data-ad-slot': '333',
      'data-ad-format': 'fluid',
      'data-ad-layout-key': '-6t+ed+2i-1n-4w',
    });
  });
});

describe('buildAdsTxt', () => {
  it('게시자 ID에서 ca-를 뗀 판매자 ID와 Google 인증 기관 ID', () => {
    expect(buildAdsTxt(CLIENT)).toBe('google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
  });

  it('미설정 시 주석만 출력', () => {
    expect(buildAdsTxt('')).toMatch(/^# /);
    expect(buildAdsTxt('')).not.toContain('google.com');
  });
});
