'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { ADSENSE_CLIENT } from '../../config';
import { getAdsenseScriptSrc, NO_ADS_ATTRIBUTE, shouldLoadAdsense } from './adsense';

const SCRIPT_ID = 'adsbygoogle-js';

/**
 * AdSense 스크립트 로더 (루트 레이아웃에 1회, 자동 광고는 이 스크립트로 게재)
 * - hydration 후 삽입: 본문 표시를 먼저 하고 광고 스크립트는 그다음에 불러옴
 * - next/script 대신 직접 삽입: next/script의 data-nscript 속성은 AdSense가 콘솔 경고를 출력
 * - 광고 제외 페이지(`NoAds`: 404·정적 페이지)에서는 로드하지 않음. 경로가 바뀔 때마다 다시 확인해,
 *   제외 페이지로 들어온 뒤 글로 이동하면 그때 로드 (한 번 로드한 스크립트는 제거하지 않음)
 */
export function AdSenseScript() {
  const pathname = usePathname();

  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isExcludedPage = document.querySelector(`[${NO_ADS_ATTRIBUTE}]`) !== null;
    if (!shouldLoadAdsense({ isDevelopment, client: ADSENSE_CLIENT, isExcludedPage })) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = getAdsenseScriptSrc(ADSENSE_CLIENT);
    document.head.appendChild(script);
  }, [pathname]);

  return null;
}
