import { execSync } from 'child_process';
import * as fs from 'fs';

import matter from 'gray-matter';

export interface ParsedMdx {
  content: string;
  metadata: Record<string, unknown>;
}

/**
 * filePath에서 MDX 섹션 추출 (blog/projects/libraries)
 *
 * @param filePath - MDX 파일의 절대 경로
 * @returns 섹션 이름 또는 null
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
 * - 출력 (dev): ![alt](/_next/dev/static/media/mdx/blog/images/test.webp)
 * - 출력 (prod): ![alt](/_next/static/media/mdx/blog/images/test.webp)
 *
 * @param content - 원본 MDX 콘텐츠
 * @param section - MDX 섹션 (blog/projects/libraries)
 * @returns 경로가 변환된 MDX 콘텐츠
 */
function transformImagePaths(content: string, section: string | null): string {
  if (!section) return content;

  // Next.js는 개발/프로덕션 모두 /_next/static/ 경로로 서빙
  const staticPath = '/_next/static/media/mdx';

  // 정규식: ./로 시작하는 모든 이미지 경로 매칭
  return content.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, `![$1](${staticPath}/${section}/$2)`);
}

/**
 * git 히스토리에서 파일의 생성/수정 날짜 추출
 */
function getGitDates(filePath: string): { createdAt?: string; updatedAt?: string } {
  try {
    // 첫 커밋 날짜 (createdAt)
    const createdAt = execSync(`git log --follow --format=%aI --reverse "${filePath}" | head -1`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'], // stderr 무시
    }).trim();

    // 마지막 커밋 날짜 (updatedAt)
    const updatedAt = execSync(`git log --follow -1 --format=%aI "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'], // stderr 무시
    }).trim();

    return {
      createdAt: createdAt || undefined,
      updatedAt: updatedAt || undefined,
    };
  } catch {
    // git이 없거나, git 저장소가 아니거나, 파일이 커밋되지 않은 경우
    return {};
  }
}

/**
 * MDX 파일 읽기 및 frontmatter 추출 (git 날짜 자동 추가)
 */
export function parseMdxFile(filePath: string): ParsedMdx {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // 섹션 추출
  const section = extractSection(filePath);

  // 이미지 경로 변환
  const transformedContent = transformImagePaths(content, section);

  // git에서 날짜 추출
  const gitDates = getGitDates(filePath);

  // frontmatter에 명시된 날짜가 없으면 git 날짜 사용
  const metadata = {
    ...data,
    createdAt: data.createdAt || gitDates.createdAt,
    updatedAt: data.updatedAt || gitDates.updatedAt,
  };

  return {
    content: transformedContent,
    metadata,
  };
}
