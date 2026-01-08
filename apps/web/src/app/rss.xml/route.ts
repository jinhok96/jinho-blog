import { getBlogPosts } from '@jinho-blog/mdx-handler';

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
  const { items: posts } = await getBlogPosts({ count: 50 });

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${SITE_NAME}</title>
  <description>${SITE_DESCRIPTION}</description>
  <link>${SITE_URL}</link>
  <language>ko</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${posts
    .map(
      post => `<item>
    <title>${escapeXml(post.title)}</title>
    <description>${escapeXml(post.description || '')}</description>
    <link>${SITE_URL}${post.path}</link>
    <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    <guid isPermaLink="false">${SITE_URL}${post.path}</guid>
  </item>`,
    )
    .join('')}
</channel>
</rss>`;

  const headers = new Headers({ 'content-type': 'application/xml' });

  return new Response(rssFeed, { headers });
}
