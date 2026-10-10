/**
 * 컬렉션 디렉토리의 이미지·비디오를 정적 디렉토리로 복사
 *
 * 소스: {contentDir}/{collection}/
 * 목적지: {staticDir}/mdx/{collection}/
 */

import * as fs from 'fs';
import * as path from 'path';

import { type CollectionMap, type ContentConfig } from '../src/core/collection';
import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from '../src/core/config';
import { resolveContentPaths } from '../src/core/paths';

type ImageFile = {
  sourcePath: string;
  relativePath: string;
};

/**
 * 파일이 이미지인지 확인
 */
export function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return (IMAGE_EXTENSIONS as readonly string[]).includes(ext);
}

/**
 * 파일이 비디오인지 확인
 */
export function isVideoFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return (VIDEO_EXTENSIONS as readonly string[]).includes(ext);
}

/**
 * 디렉토리 재귀 생성
 */
export function ensureDirSync(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 디렉토리를 재귀적으로 스캔하여 이미지·비디오 파일 목록 반환
 */
export function scanImagesRecursive(dir: string, baseDir: string = ''): ImageFile[] {
  const images: ImageFile[] = [];

  if (!fs.existsSync(dir)) return images;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(baseDir, entry.name);

    if (entry.isDirectory()) {
      // 재귀적으로 하위 디렉토리 스캔
      images.push(...scanImagesRecursive(fullPath, relativePath));
    } else if (entry.isFile() && (isImageFile(entry.name) || isVideoFile(entry.name))) {
      images.push({
        sourcePath: fullPath,
        relativePath: relativePath,
      });
    }
  }

  return images;
}

/**
 * 콘텐츠 설정 기반 미디어 복사
 * - 경로는 process.cwd()(앱 루트) 기준
 * - `copyMedia: false`인 컬렉션은 건너뜀
 */
export function copyContentMedia<TCollections extends CollectionMap>(config: ContentConfig<TCollections>): void {
  const paths = resolveContentPaths(config);
  const collections: CollectionMap = config.collections;

  let totalCopied = 0;

  console.log(`\n📸 MDX 이미지 복사 시작\n`);

  for (const [name, definition] of Object.entries(collections)) {
    if (definition.copyMedia === false) {
      console.log(`⏭️  ${name}: 복사 비활성화 (copyMedia: false)`);
      continue;
    }

    const sourceDir = paths.collectionDir(name);

    if (!fs.existsSync(sourceDir)) {
      console.warn(`⚠️  컬렉션 디렉토리를 찾을 수 없습니다: ${name}`);
      continue;
    }

    // 컬렉션 내 모든 이미지 스캔 (재귀)
    const images = scanImagesRecursive(sourceDir);

    if (images.length === 0) {
      console.log(`ℹ️  ${name} 컬렉션에 이미지가 없습니다`);
      continue;
    }

    const destDir = paths.mediaDir(name);
    let copied = 0;

    // 이미지 복사
    for (const img of images) {
      try {
        const destPath = path.join(destDir, img.relativePath);

        // 디렉토리 생성
        ensureDirSync(path.dirname(destPath));

        // 파일 복사
        fs.copyFileSync(img.sourcePath, destPath);
        copied++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ 복사 실패: ${img.relativePath}`, errorMessage);
      }
    }

    totalCopied += copied;
    console.log(`✅ ${name}: ${copied}개 이미지 복사 완료 → ${destDir}`);
  }

  console.log(`\n📸 총 ${totalCopied}개 이미지 복사 완료\n`);
}
