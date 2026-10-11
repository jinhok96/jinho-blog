'use client';

import { useEffect } from 'react';

import { ADSENSE_CLIENT } from '../../config';
import { getAdsenseScriptSrc, shouldLoadAdsense } from './adsense';

const SCRIPT_ID = 'adsbygoogle-js';

/**
 * AdSense 스크립트 로더 (루트 레이아웃에 1회)
 * - hydration 후 삽입: 본문 표시를 먼저 하고 광고 스크립트는 그다음에 불러옴
 * - next/script 대신 직접 삽입: next/script의 data-nscript 속성은 AdSense가 콘솔 경고를 출력
 */
export function AdSenseScript() {
  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!shouldLoadAdsense({ isDevelopment, client: ADSENSE_CLIENT })) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = getAdsenseScriptSrc(ADSENSE_CLIENT);
    document.head.appendChild(script);
  }, []);

  return null;
}
