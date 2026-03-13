/**
 * MDX 이미지를 Next.js public 디렉토리로 복사
 *
 * 소스: content/mdx/{section}/
 * 목적지: apps/web/public/_static/mdx/{section}/
 *
 * 실행: npm run copy-images
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { PATHS } from '../src/core/config';
import type { ContentSection } from '../src/types';

interface ImageFile {
  sourcePath: string;
  relativePath: string;
}

const SECTIONS: ContentSection[] = ['blog', 'projects', 'libraries'];
const IMAGE_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg'];

/**
 * 모노레포 루트 찾기 (package.json에 workspaces가 있는 디렉토리)
 */
function findMonorepoRoot(): string {
  let currentDir = process.cwd();

  while (currentDir !== path.parse(currentDir).root) {
    const pkgPath = path.join(currentDir, 'package.json');

    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.workspaces) {
        return currentDir;
      }
    }

    currentDir = path.dirname(currentDir);
  }

  // fallback: 스크립트가 packages/mdx-handler/scripts에 있다고 가정
  return path.join(fileURLToPath(new URL('../../..', import.meta.url)));
}

const MONOREPO_ROOT = findMonorepoRoot();

/**
 * 파일이 이미지인지 확인
 */
function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * 디렉토리 재귀 생성
 */
function ensureDirSync(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 디렉토리를 재귀적으로 스캔하여 이미지 파일 목록 반환
 */
function scanImagesRecursive(dir: string, baseDir: string = ''): ImageFile[] {
  const images: ImageFile[] = [];

  if (!fs.existsSync(dir)) return images;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(baseDir, entry.name);

    if (entry.isDirectory()) {
      // 재귀적으로 하위 디렉토리 스캔
      images.push(...scanImagesRecursive(fullPath, relativePath));
    } else if (entry.isFile() && isImageFile(entry.name)) {
      images.push({
        sourcePath: fullPath,
        relativePath: relativePath,
      });
    }
  }

  return images;
}

/**
 * MDX 이미지 복사 메인 함수
 */
function copyMdxImages(): void {
  const baseStaticPath = PATHS.PUBLIC_STATIC_MDX_DIR;

  let totalCopied = 0;

  console.log(`\n📸 MDX 이미지 복사 시작\n`);

  for (const section of SECTIONS) {
    const sectionDir = path.join(MONOREPO_ROOT, PATHS.MDX_CONTENT_DIR, section);

    if (!fs.existsSync(sectionDir)) {
      console.warn(`⚠️  섹션 디렉토리를 찾을 수 없습니다: ${section}`);
      continue;
    }

    // 섹션 내 모든 이미지 스캔 (재귀)
    const images = scanImagesRecursive(sectionDir);

    if (images.length === 0) {
      console.log(`ℹ️  ${section} 섹션에 이미지가 없습니다`);
      continue;
    }

    // 이미지 복사
    for (const img of images) {
      try {
        const destPath = path.join(MONOREPO_ROOT, baseStaticPath, section, img.relativePath);

        // 디렉토리 생성
        ensureDirSync(path.dirname(destPath));

        // 파일 복사
        fs.copyFileSync(img.sourcePath, destPath);
        totalCopied++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ 복사 실패: ${img.relativePath}`, errorMessage);
      }
    }

    console.log(`✅ ${section}: ${images.length}개 이미지 복사 완료`);
  }

  console.log(`\n📸 총 ${totalCopied}개 이미지 복사 완료`);
  console.log(`📁 대상 경로: ${baseStaticPath}\n`);
}

export { copyMdxImages, ensureDirSync, findMonorepoRoot, isImageFile, scanImagesRecursive };

// 실행
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  copyMdxImages();
}
