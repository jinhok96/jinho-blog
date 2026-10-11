import { describe, expect, it } from 'vitest';

import { AD_SLOTS, ADSENSE_CLIENT, validateAdsConfig } from './ads';

const display = { slotId: '1234567890', layout: 'display' } as const;

describe('validateAdsConfig', () => {
  it('현재 설정은 유효 (빌드 시 모듈 로드에서 검증됨)', () => {
    expect(() => validateAdsConfig(ADSENSE_CLIENT, AD_SLOTS)).not.toThrow();
  });

  it('미설정(빈 값)은 허용', () => {
    expect(() => validateAdsConfig('', { a: { slotId: '', layout: 'display' } })).not.toThrow();
  });

  it('올바른 게시자 ID·광고 단위 ID 통과', () => {
    expect(() => validateAdsConfig('ca-pub-1234567890123456', { a: display })).not.toThrow();
  });

  it.each(['pub-1234567890123456', 'ca-pub-123', 'ca-pub-12345678901234567'])('게시자 ID 형식 오류: %s', client => {
    expect(() => validateAdsConfig(client, {})).toThrow('ADSENSE_CLIENT 형식 오류');
  });

  it('광고 단위 ID는 숫자만', () => {
    expect(() => validateAdsConfig('', { postTop: { slotId: 'abc', layout: 'display' } })).toThrow(
      'AD_SLOTS.postTop.slotId 형식 오류',
    );
  });

  it('in-feed 광고는 layoutKey 필수', () => {
    expect(() => validateAdsConfig('', { listInFeed: { slotId: '1', layout: 'in-feed' } })).toThrow('layoutKey');
  });

  it('광고 단위 ID만 있고 게시자 ID가 없으면 에러 (모든 슬롯이 조용히 숨겨지지 않도록)', () => {
    expect(() => validateAdsConfig('', { postTop: display })).toThrow('ADSENSE_CLIENT도 입력');
  });

  it('같은 광고 단위 ID를 여러 위치에 쓰면 에러', () => {
    expect(() =>
      validateAdsConfig('ca-pub-1234567890123456', { postTop: display, postBottom: { ...display } }),
    ).toThrow('AD_SLOTS.postBottom.slotId가 AD_SLOTS.postTop와 같습니다');
  });
});
