import { z } from 'zod';

import { frontmatterSchema } from '@jinho-blog/mdx-handler';
import { BLOG_CATEGORIES, PROJECT_CATEGORIES, TECH_STACKS, TRANSLATE_CATEGORIES } from '@jinho-blog/shared';

// 빌드 스크립트(tsx)에서도 import되므로 `@/` 별칭 대신 패키지·상대 경로만 사용

const requiredText = z.string().trim().min(1);

// 기술 스택 배열 (1개 이상)
const techStacks = z.array(z.enum(TECH_STACKS)).min(1);

/**
 * 블로그 frontmatter
 */
export const blogSchema = frontmatterSchema.extend({
  category: z.enum(BLOG_CATEGORIES),
});

/**
 * 프로젝트 frontmatter
 */
export const projectSchema = frontmatterSchema.extend({
  category: z.enum(PROJECT_CATEGORIES),
  tech: techStacks,
  period: requiredText,
  members: requiredText,
  links: z.array(z.url()).optional(),
});

/**
 * 라이브러리 frontmatter
 * - 카테고리는 기술 스택 (LibraryCategory = TechStack)
 */
export const librarySchema = frontmatterSchema.extend({
  category: z.enum(TECH_STACKS),
  tech: techStacks,
});

/**
 * 번역 frontmatter
 */
export const translateSchema = frontmatterSchema.extend({
  category: z.enum(TRANSLATE_CATEGORIES),
  sourceUrl: z.url(),
});
