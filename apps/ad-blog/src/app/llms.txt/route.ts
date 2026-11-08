import { getPages } from '@/entities/page';
import { getPosts } from '@/entities/post';

import { buildLlmsTxt } from './llms';

/** 정적 export(`output: 'export'`)는 Route Handler를 빌드 시 out/llms.txt 파일로 생성하도록 명시해야 함 */
export const dynamic = 'force-static';

/**
 * AI 검색·에이전트용 사이트 안내 (/llms.txt)
 * - 요청 정보를 읽지 않음 (정적 export 제약)
 */
export function GET(): Response {
  return new Response(buildLlmsTxt(getPosts(), getPages()), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
