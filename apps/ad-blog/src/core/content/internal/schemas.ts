import { z } from 'zod';

import { frontmatterDate, frontmatterSchema } from '@jinho-blog/mdx-handler';

import { CATEGORIES } from '../../config';

/** 수정일이 발행일보다 앞서면 검증 실패 (sitemap lastmod·dateModified가 발행일보다 이른 값이 되지 않도록) */
const DATE_ORDER = {
  check: (data: { createdAt: string; updatedAt?: string }) => !data.updatedAt || data.updatedAt >= data.createdAt,
  params: { message: '수정일(updatedAt)은 발행일(createdAt)과 같거나 이후여야 합니다.', path: ['updatedAt'] },
};

/**
 * 글 frontmatter
 * - createdAt 필수: 날짜는 frontmatter만 사용 (빌드 환경과 무관하게 고정)
 * - updatedAt 미지정 시 발행일과 동일 (내용을 크게 고치면 직접 갱신)
 * - tags는 메타 키워드·관련 글 계산용 (태그 페이지 없음)
 * - draft: true인 글은 개발 서버에서만 노출
 */
export const postSchema = frontmatterSchema
  .extend({
    category: z.enum(CATEGORIES),
    tags: z.array(z.string().trim().min(1)).default([]),
    createdAt: frontmatterDate,
    draft: z.boolean().default(false),
  })
  .refine(DATE_ORDER.check, DATE_ORDER.params);

/**
 * 정적 페이지 frontmatter (소개, 개인정보처리방침, 문의 등)
 * - createdAt 필수 (글과 같은 날짜 규칙)
 */
export const pageSchema = frontmatterSchema
  .extend({
    createdAt: frontmatterDate,
  })
  .refine(DATE_ORDER.check, DATE_ORDER.params);
