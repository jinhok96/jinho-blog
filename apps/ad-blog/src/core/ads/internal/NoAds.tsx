import { NO_ADS_ATTRIBUTE } from './adsense';

/**
 * 광고 제외 페이지 표시 (404·정적 페이지에 1개)
 * - 이 표시가 있는 페이지에서는 `AdSenseScript`가 스크립트를 로드하지 않아 자동 광고가 들어가지 않음
 * - AdSense 정책: 오류 페이지·콘텐츠가 없는 페이지에는 광고 금지
 */
export function NoAds() {
  return (
    <div
      {...{ [NO_ADS_ATTRIBUTE]: '' }}
      hidden
    />
  );
}
