/**
 * 외부 링크 여부 (`http(s)://`, 프로토콜 상대 URL `//`)
 * - 새 탭 + `rel="noopener noreferrer"` 적용 대상
 */
export function isExternalHref(href: string): boolean {
  return /^(?:https?:)?\/\//i.test(href.trim());
}

/**
 * 사이트 내부 페이지 경로 여부 (`/`로 시작, `//` 제외)
 * - next/link 적용 대상 (`#앵커`, `mailto:` 등은 일반 `<a>`)
 */
export function isInternalPath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}
