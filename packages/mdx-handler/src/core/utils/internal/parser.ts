import * as fs from 'fs';

import matter from 'gray-matter';

export interface ParsedMdx {
  content: string;
}

/**
 * filePath에서 MDX 섹션 추출 (blog/projects/libraries)
 */
function extractSection(filePath: string): string | null {
  const match = filePath.match(/content[\/\\]mdx[\/\\](blog|projects|libraries)[\/\\]/);
  return match ? match[1] : null;
}

/**
 * MDX 콘텐츠의 이미지 경로를 Next.js static 경로로 변환
 *
 * 변환 예시:
 * - 입력: ![alt](./images/test.webp)
 * - 출력: ![alt](/_next/static/media/mdx/blog/images/test.webp)
 */
function transformImagePaths(content: string, section: string | null): string {
  if (!section) return content;

  const staticPath = '/_next/static/media/mdx';
  return content.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, `![$1](${staticPath}/${section}/$2)`);
}

/**
 * MDX 파일 읽기 및 이미지 경로 변환
 * (런타임 전용 - 빌드 타임 로직은 scripts/build-registry.ts 참고)
 */
export function parseMdxFile(filePath: string): ParsedMdx {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);

  // 섹션 추출
  const section = extractSection(filePath);

  // 이미지 경로 변환
  const transformedContent = transformImagePaths(content, section);

  return {
    content: transformedContent,
  };
}
