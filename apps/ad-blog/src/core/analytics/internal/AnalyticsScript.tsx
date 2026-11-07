'use client';

import type { GtagTarget } from './google';

import { useEffect } from 'react';

import { CF_WEB_ANALYTICS_TOKEN, GA_MEASUREMENT_ID, SITE_URL } from '../../config';
import { CF_BEACON_SRC, getBeaconConfig, shouldLoadAnalytics } from './cloudflare';
import { getGtagSrc, initGtag } from './google';

const CF_SCRIPT_ID = 'cf-web-analytics-js';
const GA_SCRIPT_ID = 'ga-gtag-js';

type LoadContext = {
  isDevelopment: boolean;
  /** 현재 페이지의 location.hostname */
  hostname: string;
};

function loadCloudflareBeacon({ isDevelopment, hostname }: LoadContext): void {
  if (!shouldLoadAnalytics({ isDevelopment, token: CF_WEB_ANALYTICS_TOKEN, hostname, siteUrl: SITE_URL })) return;
  if (document.getElementById(CF_SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = CF_SCRIPT_ID;
  script.defer = true;
  script.src = CF_BEACON_SRC;
  script.dataset.cfBeacon = getBeaconConfig(CF_WEB_ANALYTICS_TOKEN);
  document.head.appendChild(script);
}

function loadGoogleAnalytics({ isDevelopment, hostname }: LoadContext): void {
  if (!shouldLoadAnalytics({ isDevelopment, token: GA_MEASUREMENT_ID, hostname, siteUrl: SITE_URL })) return;
  if (document.getElementById(GA_SCRIPT_ID)) return;

  // 동의 기본값·config를 dataLayer에 먼저 넣은 뒤 gtag.js 로드 (로드되면 쌓인 명령을 순서대로 처리)
  initGtag(window as Window & GtagTarget, GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = getGtagSrc(GA_MEASUREMENT_ID);
  document.head.appendChild(script);
}

/**
 * 방문 측정 스크립트 로더 (루트 레이아웃에 1회): Cloudflare Web Analytics + Google Analytics 4
 * - 개발 서버·사이트 도메인이 아닌 호스트(미리보기 배포 등)에서는 로드 안 함. 두 스크립트는 서로 독립적으로 로드
 * - Cloudflare: 쿠키 없이 JS를 실행한 방문만 집계 (대부분의 봇 제외)
 * - GA4: 유럽(EEA·영국·스위스)은 동의 모드 기본값 거부 → 동의 전에는 쿠키 없이 측정
 * - 한 번 로드하면 클라이언트 라우팅(History API) 페이지 이동도 각 스크립트가 직접 집계하므로 다시 삽입하지 않음
 *   (GA4는 향상된 측정의 "브라우저 기록 이벤트 기반 페이지 변경")
 * - next/script 대신 직접 삽입 (AdSenseScript와 같은 방식)
 */
export function AnalyticsScript() {
  useEffect(() => {
    const context: LoadContext = {
      isDevelopment: process.env.NODE_ENV === 'development',
      hostname: window.location.hostname,
    };
    loadCloudflareBeacon(context);
    loadGoogleAnalytics(context);
  }, []);

  return null;
}
