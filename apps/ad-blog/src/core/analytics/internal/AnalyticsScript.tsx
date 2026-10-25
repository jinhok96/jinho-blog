'use client';

import { useEffect } from 'react';

import { CF_WEB_ANALYTICS_TOKEN, SITE_URL } from '../../config';
import { CF_BEACON_SRC, getBeaconConfig, shouldLoadAnalytics } from './cloudflare';

const SCRIPT_ID = 'cf-web-analytics-js';

/**
 * Cloudflare Web Analytics 비컨 로더 (루트 레이아웃에 1회)
 * - 쿠키 없이 JS를 실행한 방문만 집계 (대부분의 봇 제외)
 * - 한 번 로드하면 클라이언트 라우팅(History API) 페이지 이동도 비컨이 직접 집계하므로 다시 삽입하지 않음
 * - next/script 대신 직접 삽입 (AdSenseScript와 같은 방식)
 */
export function AnalyticsScript() {
  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const { hostname } = window.location;
    if (!shouldLoadAnalytics({ isDevelopment, token: CF_WEB_ANALYTICS_TOKEN, hostname, siteUrl: SITE_URL })) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.defer = true;
    script.src = CF_BEACON_SRC;
    script.dataset.cfBeacon = getBeaconConfig(CF_WEB_ANALYTICS_TOKEN);
    document.head.appendChild(script);
  }, []);

  return null;
}
