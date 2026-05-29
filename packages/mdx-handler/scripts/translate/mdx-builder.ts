import type { SourceLicense } from '../../src/core/config';

export function normalizeHeadings(markdown: string): string {
  const hasH1 = /^# /m.test(markdown);
  if (hasH1) return markdown;
  return markdown.replace(/^(#{2,}) /gm, (_, hashes) => '#'.repeat(hashes.length - 1) + ' ');
}

export function generateSlug(category: string, url: string): string {
  const urlObj = new URL(url);
  const lastSegment = urlObj.pathname.replace(/\/$/, '').split('/').pop() || 'post';
  const sanitized = lastSegment.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  return `${category}-${sanitized}`;
}

export function buildMdxContent(meta: {
  title: string;
  description: string;
  category: string;
  sourceUrl: string;
  sourceName: string;
  originalTitle: string;
  translatedBody: string;
  createdAt?: string;
  license: SourceLicense;
  licenseUrl?: string;
}): string {
  const yamlStr = (v: string) => {
    const needsQuote = /[:#\[\]{},|>&*!'"@%`]/.test(v) || v.startsWith(' ') || v.endsWith(' ');
    if (!needsQuote) return v;
    return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  };

  const frontmatter = [
    '---',
    `title: ${yamlStr(meta.title)}`,
    `description: ${yamlStr(meta.description)}`,
    `category: ${meta.category}`,
    `sourceUrl: ${meta.sourceUrl}`,
    ...(meta.createdAt ? [`createdAt: ${meta.createdAt}`] : []),
    '---',
  ].join('\n');

  const isCc = meta.license !== 'all-rights-reserved';
  const attribution = [
    `> 원문: [${meta.originalTitle}](${meta.sourceUrl}) — ${meta.sourceName}`,
    isCc
      ? `> 원문은 [${meta.license.toUpperCase()}](${meta.licenseUrl}) 라이선스로 제공되며, 이 글은 한국어로 번역한 2차 저작물입니다.`
      : `> 이 글은 원문의 핵심 내용을 요약한 것입니다. 저작권은 원문 저자에게 있으며, 자세한 내용은 원문에서 확인하세요.`,
  ].join('\n');

  return `${frontmatter}\n\n${attribution}\n\n${meta.translatedBody}\n`;
}
