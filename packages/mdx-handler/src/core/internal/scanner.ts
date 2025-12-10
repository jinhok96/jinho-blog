import * as fs from 'fs';
import * as path from 'path';

export type ContentSection = 'blog' | 'projects' | 'libraries';

export interface ScannedFile {
  slug: string;
  filePath: string;
}

/**
 * MDX 디렉토리를 스캔하여 모든 .mdx 파일 찾기
 * 경로: content/mdx/{section}/{slug}.mdx
 */
export function scanMdxDirectory(section: ContentSection): ScannedFile[] {
  const mdxDir = path.join(process.cwd(), 'content', 'mdx', section);
  const files: ScannedFile[] = [];

  if (!fs.existsSync(mdxDir)) {
    console.warn(`⚠️  Warning: MDX directory not found: ${mdxDir}`);
    return files;
  }

  const items = fs.readdirSync(mdxDir, { withFileTypes: true });

  for (const item of items) {
    if (item.isFile() && item.name.endsWith('.mdx')) {
      const fullPath = path.join(mdxDir, item.name);
      const slug = item.name.replace(/\.mdx$/, '');

      files.push({
        slug,
        filePath: fullPath,
      });
    }
  }

  return files;
}
