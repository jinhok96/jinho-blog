/**
 * 빌드 전용 엔트리 (`@jinho-blog/mdx-handler/build`)
 * - 앱의 콘텐츠 설정으로 레지스트리 생성·미디어 복사
 */

export { buildContentRegistry } from './build-registry';
export { copyContentMedia } from './copy-mdx-images';
export { type ContentPaths, resolveContentPaths } from '../src/core/paths';
