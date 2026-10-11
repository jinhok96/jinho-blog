/**
 * 외부 링크 여부 (`http(s)://`, 프로토콜 상대 URL `//`)
 * - 새 탭 + `rel="noopener noreferrer"` 적용 대상
 */
export function isExternalHref(href: string): boolean {
  return /^(?:https?:)?\/\//i.test(href.trim());
}

/**
 * 사이트 내부 경로 여부 (`/`로 시작, `//` 제외)
 * - `#앵커`, `mailto:` 등은 제외
 */
export function isInternalPath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

/**
 * 사이트 내부 페이지 링크 여부 (next/link 적용 대상)
 * - 확장자가 있는 파일 경로(`/rss.xml`, `/_static/...pdf`)는 페이지가 아니므로 제외 (일반 `<a>`)
 */
export function isInternalPageLink(href: string): boolean {
  if (!isInternalPath(href)) return false;

  const pathname = href.split(/[?#]/)[0];
  return !/\.[a-z0-9]+$/i.test(pathname);
}
