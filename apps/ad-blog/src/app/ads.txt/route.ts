import { buildAdsTxt } from '@/core/ads';
import { ADSENSE_CLIENT } from '@/core/config';

/** 정적 export(`output: 'export'`)는 빌드 시 ads.txt 파일로 생성하도록 명시해야 함 */
export const dynamic = 'force-static';

/**
 * ads.txt (승인된 광고 판매자 목록)
 * - AdSense 게시자 ID로 생성, 미설정 시 주석만 출력
 */
export function GET() {
  return new Response(buildAdsTxt(ADSENSE_CLIENT), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
