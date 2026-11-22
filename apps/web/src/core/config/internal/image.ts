/**
 * next/image 최적화를 허용할 원격 이미지 호스트 (next.config `images.remotePatterns`와 공유)
 */
export const REMOTE_IMAGE_HOSTS = ['vercel.com', 'developer.chrome.com', 'web.dev', 'claude.dev'] as const;

/**
 * next/image 최적화 가능 여부.
 * 로컬 경로이거나 허용된 원격 호스트면 true.
 * 허용되지 않은 원격 호스트는 최적화하면 오류가 나므로 `unoptimized`로 렌더링해야 한다.
 */
export function isOptimizableImageSrc(src: string): boolean {
  if (!/^https?:\/\//.test(src)) return true;

  try {
    const { hostname } = new URL(src);
    return (REMOTE_IMAGE_HOSTS as readonly string[]).includes(hostname);
  } catch {
    return false;
  }
}
