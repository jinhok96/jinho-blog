import type { UrlObject } from 'url';

export function stringifyURL(href: string | UrlObject): string {
  if (typeof href === 'string') return href;

  const pathname = href.pathname ?? '';
  const query = href.query ? `?${new URLSearchParams(href.query as Record<string, string>).toString()}` : '';
  const hash = href.hash ?? '';

  return `${pathname}${query}${hash}`;
}
