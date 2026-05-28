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

  const originLine = `> 원문: [${meta.originalTitle}](${meta.sourceUrl}) — ${meta.sourceName}`;

  return `${frontmatter}\n\n${originLine}\n\n${meta.translatedBody}\n`;
}
