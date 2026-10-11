import * as fs from 'fs';
import * as path from 'path';

import { buildContentRegistry, copyContentMedia } from '@jinho-blog/mdx-handler/build';
import { generateOgImage, generateThumbnail } from '@jinho-blog/thumbnail-generator';

import { DEFAULT_OG_IMAGE, SITE_NAME } from '../src/core/config';
import { contentConfig } from '../src/core/content';

/**
 * 기본 OG 이미지 생성 (SITE_NAME → public{DEFAULT_OG_IMAGE}, 1200x630 JPEG)
 * - 글 썸네일과 같은 템플릿으로 WebP를 만든 뒤 OG 규격 JPEG로 변환
 * - 중간 WebP는 배포되지 않도록 삭제
 */
async function buildDefaultOgImage() {
  const outputPath = path.join(process.cwd(), 'public', DEFAULT_OG_IMAGE);
  const tempPath = `${outputPath}.tmp.webp`;

  try {
    await generateThumbnail({ title: SITE_NAME, outputPath: tempPath });
    await generateOgImage({ inputPath: tempPath, outputPath });
  } finally {
    fs.rmSync(tempPath, { force: true });
  }

  console.log(`🖼️  Default OG image: ${path.relative(process.cwd(), outputPath)}`);
}

/**
 * 콘텐츠 레지스트리 생성
 * 1. 컬렉션 미디어를 정적 디렉토리로 복사
 * 2. frontmatter 검증 후 .content/registry.json 생성 (썸네일·OG 이미지 포함)
 * 3. 사이트 기본 OG 이미지 생성
 */
async function main() {
  copyContentMedia(contentConfig);
  await buildContentRegistry(contentConfig);
  await buildDefaultOgImage();
}

main().catch(error => {
  console.error('❌ Registry build failed:', error);
  process.exit(1);
});
