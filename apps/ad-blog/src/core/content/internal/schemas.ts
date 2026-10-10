import { z } from 'zod';

import { frontmatterDate, frontmatterSchema } from '@jinho-blog/mdx-handler';

import { CATEGORIES } from '../../config';

/**
 * 글 frontmatter
 * - createdAt 필수: 발행일을 명시해 빌드 환경(Git 이력 유무)과 무관하게 날짜를 고정
 * - updatedAt 미지정 시 Git 마지막 커밋 날짜 사용
 * - tags는 메타 키워드·관련 글 계산용 (태그 페이지 없음)
 * - draft: true인 글은 개발 서버에서만 노출
 */
export const postSchema = frontmatterSchema.extend({
  category: z.enum(CATEGORIES),
  tags: z.array(z.string().trim().min(1)).default([]),
  createdAt: frontmatterDate,
  draft: z.boolean().default(false),
});

/**
 * 정적 페이지 frontmatter (소개, 개인정보처리방침, 문의 등)
 */
export const pageSchema = frontmatterSchema;
