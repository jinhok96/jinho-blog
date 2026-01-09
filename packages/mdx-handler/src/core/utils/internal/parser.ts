import { execSync } from 'child_process';
import * as fs from 'fs';

import matter from 'gray-matter';

export interface ParsedMdx {
  content: string;
  metadata: Record<string, unknown>;
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

  // git에서 날짜 추출
  const gitDates = getGitDates(filePath);

  // frontmatter에 명시된 날짜가 없으면 git 날짜 사용
  const metadata = {
    ...data,
    createdAt: data.createdAt || gitDates.createdAt,
    updatedAt: data.updatedAt || gitDates.updatedAt,
  };

  return {
    content,
    metadata,
  };
}
