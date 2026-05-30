import { fileURLToPath } from 'url';

import { translateNewPosts } from './translate/orchestrator.js';

export { buildMdxContent, generateSlug } from './translate/mdx-builder.js';
export { translateNewPosts };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  translateNewPosts()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ 번역 스크립트 실패:', error);
      process.exit(1);
    });
}
