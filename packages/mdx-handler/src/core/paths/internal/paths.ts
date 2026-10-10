import type { ContentConfig } from '../../collection';

import * as path from 'path';

export type ContentPaths = {
  /** 컬렉션 MDX 디렉토리 (절대 경로) */
  collectionDir: (name: string) => string;
  /** 레지스트리 JSON (절대 경로) */
  registryFile: string;
  /** 미디어 출력 루트 디렉토리 (절대 경로) */
  mediaRootDir: string;
  /** 미디어 루트 공개 URL */
  mediaRootUrl: string;
  /** 컬렉션 미디어 출력 디렉토리 (절대 경로) */
  mediaDir: (name: string) => string;
  /** 컬렉션 미디어 공개 URL */
  mediaUrl: (name: string) => string;
};

/**
 * 콘텐츠 설정의 상대 경로를 앱 루트 기준 절대 경로로 변환 (빌드 전용)
 * - 런타임 엔트리에서 제외: 동적 경로 연산이 번들러 파일 트레이싱에 포함되지 않도록 함
 */
export function resolveContentPaths(
  config: Pick<ContentConfig, 'contentDir' | 'staticDir' | 'staticUrl'>,
  rootDir: string = process.cwd(),
): ContentPaths {
  const contentRoot = path.resolve(rootDir, config.contentDir);
  const staticRoot = path.resolve(rootDir, config.staticDir);
  const mediaRootDir = path.join(staticRoot, 'mdx');
  const mediaRootUrl = `${config.staticUrl.replace(/\/+$/, '')}/mdx`;

  return {
    collectionDir: name => path.join(contentRoot, name),
    registryFile: path.join(staticRoot, 'registry.json'),
    mediaRootDir,
    mediaRootUrl,
    mediaDir: name => path.join(mediaRootDir, name),
    mediaUrl: name => `${mediaRootUrl}/${name}`,
  };
}
