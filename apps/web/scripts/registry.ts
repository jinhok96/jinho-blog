import { buildContentRegistry, copyContentMedia } from '@jinho-blog/mdx-handler/build';

import { contentConfig } from '../src/core/content';

/**
 * 콘텐츠 레지스트리 생성
 * 1. 컬렉션 미디어를 정적 디렉토리로 복사
 * 2. frontmatter 검증 후 registry.json 생성
 */
async function main() {
  copyContentMedia(contentConfig);
  await buildContentRegistry(contentConfig);
}

main().catch(error => {
  console.error('❌ Registry build failed:', error);
  process.exit(1);
});
