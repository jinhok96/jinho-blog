import { getBlogPosts, getTranslatePosts } from '@jinho-blog/mdx-handler';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/core/config';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export async function GET() {
  const [{ items: blogPosts }, { items: translatePosts }] = await Promise.all([
    getBlogPosts({ count: 50 }),
    getTranslatePosts({ count: 50 }),
  ]);

  const allPosts = [
    ...blogPosts.map(post => ({ ...post, isTranslate: false as const })),
    ...translatePosts.map(post => ({ ...post, isTranslate: true as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>${SITE_NAME}</title>
  <description>${SITE_DESCRIPTION}</description>
  <link>${SITE_URL}</link>
  <language>ko</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${allPosts
    .map(post => {
      const title = post.isTranslate ? `[번역] ${escapeXml(post.title)}` : escapeXml(post.title);
      const sourceUrl = post.isTranslate ? `\n    <dc:source>${escapeXml(post.sourceUrl)}</dc:source>` : '';
      return `<item>
    <title>${title}</title>
    <description>${escapeXml(post.description || '')}</description>
    <link>${SITE_URL}${post.path}</link>
    <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    <guid isPermaLink="false">${SITE_URL}${post.path}</guid>${sourceUrl}
  </item>`;
    })
    .join('')}
</channel>
</rss>`;

  const headers = new Headers({ 'content-type': 'application/xml' });

  return new Response(rssFeed, { headers });
}
