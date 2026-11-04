import type { GtagTarget } from './google';

import { describe, expect, it, vi } from 'vitest';

import { CONSENT_REQUIRED_REGIONS, getConsentDefault, getGtagSrc, GTAG_SRC, initGtag } from './google';

const ID = 'G-TEST123';

describe('getGtagSrc', () => {
  it('측정 ID를 id 쿼리로 전달', () => {
    expect(getGtagSrc(ID)).toBe(`https://www.googletagmanager.com/gtag/js?id=${ID}`);
  });

  it('측정 ID는 URL 인코딩', () => {
    expect(getGtagSrc('G-A&B')).toBe(`${GTAG_SRC}?id=G-A%26B`);
  });
});

describe('CONSENT_REQUIRED_REGIONS', () => {
  it('EEA 30개국 + 영국·스위스 = 32개, 중복 없음', () => {
    expect(CONSENT_REQUIRED_REGIONS).toHaveLength(32);
    expect(new Set(CONSENT_REQUIRED_REGIONS).size).toBe(32);
  });

  it('ISO 3166-1 alpha-2 형식', () => {
    for (const region of CONSENT_REQUIRED_REGIONS) {
      expect(region).toMatch(/^[A-Z]{2}$/);
    }
  });

  it('영국·스위스·EU 외 EEA 포함, 미국 미포함', () => {
    expect(CONSENT_REQUIRED_REGIONS).toEqual(expect.arrayContaining(['GB', 'CH', 'NO', 'IS', 'LI']));
    expect(CONSENT_REQUIRED_REGIONS).not.toContain('US');
  });
});

describe('getConsentDefault', () => {
  it('유럽 지역만 모든 저장소 거부 + update 대기', () => {
    expect(getConsentDefault()).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      region: [...CONSENT_REQUIRED_REGIONS],
      wait_for_update: 500,
    });
  });

  it('region은 복사본 (상수가 바뀌지 않도록)', () => {
    expect(getConsentDefault().region).not.toBe(CONSENT_REQUIRED_REGIONS);
  });
});

describe('initGtag', () => {
  it('dataLayer에 consent default → js → config 순으로 등록', () => {
    const target: GtagTarget = {};
    initGtag(target, ID);

    expect(target.dataLayer?.map(entry => Array.from(entry as ArrayLike<unknown>))).toEqual([
      ['consent', 'default', getConsentDefault()],
      ['js', expect.any(Date)],
      ['config', ID],
    ]);
  });

  it('dataLayer 항목은 배열이 아닌 arguments 객체 (gtag.js가 명령으로 인식하는 형태)', () => {
    const target: GtagTarget = {};
    initGtag(target, ID);

    for (const entry of target.dataLayer ?? []) {
      expect(Array.isArray(entry)).toBe(false);
      expect(Object.prototype.toString.call(entry)).toBe('[object Arguments]');
    }
  });

  it('기존 dataLayer 항목은 유지하고 뒤에 추가', () => {
    const existing = { event: 'existing' };
    const dataLayer: unknown[] = [existing];
    const target: GtagTarget = { dataLayer };
    initGtag(target, ID);

    expect(target.dataLayer).toBe(dataLayer);
    expect(dataLayer[0]).toBe(existing);
    expect(dataLayer).toHaveLength(4);
  });

  it('기존 gtag가 있으면 덮어쓰지 않고 그 gtag로 등록', () => {
    const gtag = vi.fn<(...args: unknown[]) => void>();
    const target: GtagTarget = { gtag };
    initGtag(target, ID);

    expect(target.gtag).toBe(gtag);
    expect(gtag.mock.calls).toEqual([
      ['consent', 'default', getConsentDefault()],
      ['js', expect.any(Date)],
      ['config', ID],
    ]);
  });
});
