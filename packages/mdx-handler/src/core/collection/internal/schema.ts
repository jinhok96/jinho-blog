import { z } from 'zod';

/**
 * frontmatter 날짜 → ISO 8601 문자열
 * - YAML 날짜(`createdAt: 2024-01-01`)는 gray-matter가 Date로 파싱
 * - 문자열 날짜도 동일한 ISO 형식으로 정규화
 */
export const frontmatterDate = z.coerce.date().transform(date => date.toISOString());

const requiredText = z.string().trim().min(1);

/**
 * 공통 frontmatter 스키마
 * - strict: 정의되지 않은 키는 검증 실패 (오타 방지)
 * - 컬렉션 스키마는 `.extend()`로 확장
 *
 * @example
 * const blogSchema = frontmatterSchema.extend({ category: z.enum(BLOG_CATEGORIES) });
 */
export const frontmatterSchema = z.strictObject({
  title: requiredText,
  description: requiredText,
  thumbnail: requiredText.optional(),
  createdAt: frontmatterDate.optional(),
  updatedAt: frontmatterDate.optional(),
});
