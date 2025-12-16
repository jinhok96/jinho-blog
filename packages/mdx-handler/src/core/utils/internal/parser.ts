import * as fs from 'fs';

import matter from 'gray-matter';

export interface ParsedMdx {
  content: string;
  metadata: Record<string, unknown>;
}

/**
 * MDX 파일 읽기 및 frontmatter 추출
 */
export function parseMdxFile(filePath: string): ParsedMdx {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    content,
    metadata: data,
  };
}
