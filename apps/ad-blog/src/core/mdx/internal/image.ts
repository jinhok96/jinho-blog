import * as fs from 'fs';
import { imageSize } from 'image-size';
import * as path from 'path';

import { VIDEO_EXTENSIONS } from '@jinho-blog/shared';

import { isInternalPath } from './link';

export type ImageDimensions = {
  width: number;
  height: number;
};

/** URL의 경로 부분 (쿼리·해시 제거) */
function stripQueryAndHash(src: string): string {
  return src.split(/[?#]/)[0];
}

/**
 * 동영상 경로 여부 (MDX 이미지 문법으로 삽입한 동영상은 `<video>`로 렌더링)
 */
export function isVideoSrc(src: string): boolean {
  const pathname = stripQueryAndHash(src).toLowerCase();
  return VIDEO_EXTENSIONS.some(extension => pathname.endsWith(extension));
}

/**
 * 로컬 이미지(`public` 기준 사이트 경로)의 원본 크기
 * - `<img width height>` 지정으로 이미지 로딩 시 레이아웃 이동(CLS) 방지
 * - 외부 URL·파일 없음·해석 불가 형식·`public` 밖 경로 → null (크기 미지정으로 렌더링)
 * - EXIF 회전(orientation 5~8) 이미지는 표시 기준으로 가로·세로를 바꿈
 */
export function resolveImageSize(
  src: string,
  publicDir: string = path.join(process.cwd(), 'public'),
): ImageDimensions | null {
  if (!isInternalPath(src)) return null;

  let pathname: string;
  try {
    pathname = decodeURIComponent(stripQueryAndHash(src));
  } catch {
    return null;
  }

  const root = path.resolve(publicDir);
  const filePath = path.join(root, pathname);
  // `/../` 등으로 public 밖 파일을 읽지 않도록 차단
  if (!filePath.startsWith(`${root}${path.sep}`)) return null;

  try {
    const { width, height, orientation } = imageSize(fs.readFileSync(filePath));
    if (!width || !height) return null;

    return orientation && orientation >= 5 ? { width: height, height: width } : { width, height };
  } catch {
    console.warn(`[mdx] 이미지 크기를 읽을 수 없습니다: ${src}`);
    return null;
  }
}
