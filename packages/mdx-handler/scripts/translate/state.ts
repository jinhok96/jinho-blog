import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import matter from 'gray-matter';

// MDX 소스 콘텐츠 디렉토리 (모노레포 루트 기준)
const MDX_CONTENT_DIR = 'content/mdx';

export interface TranslatedInfo {
  urls: Set<string>;
  /** 소스 카테고리 → 번역된 URL Set */
  byCategory: Map<string, Set<string>>;
}

export function findMonorepoRoot(): string {
  let currentDir = process.cwd();
  while (currentDir !== path.parse(currentDir).root) {
    const pkgPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { workspaces?: unknown };
      if (pkg.workspaces) return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return fileURLToPath(new URL('../../../..', import.meta.url));
}

export function getMdxDir(monorepoRoot?: string): string {
  const root = monorepoRoot ?? findMonorepoRoot();
  return path.join(root, MDX_CONTENT_DIR, 'translate');
}

export function getTranslatedInfo(mdxDir: string): TranslatedInfo {
  const urls = new Set<string>();
  const byCategory = new Map<string, Set<string>>();

  if (!fs.existsSync(mdxDir)) return { urls, byCategory };

  const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(mdxDir, file), 'utf-8');
    const { data } = matter(content);
    if (data.sourceUrl && typeof data.sourceUrl === 'string') {
      urls.add(data.sourceUrl);

      if (data.category && typeof data.category === 'string') {
        if (!byCategory.has(data.category)) {
          byCategory.set(data.category, new Set());
        }
        byCategory.get(data.category)!.add(data.sourceUrl);
      }
    }
  }

  return { urls, byCategory };
}
