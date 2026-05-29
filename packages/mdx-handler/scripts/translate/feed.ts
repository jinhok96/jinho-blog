import RssParser from 'rss-parser';

export interface FeedItem {
  title: string;
  link: string;
  summary?: string;
  /** YYYY-MM-DD 포맷으로 정규화됨 */
  pubDate?: string;
}

export async function fetchFeedItems(rssUrl: string): Promise<FeedItem[]> {
  const parser = new RssParser();
  try {
    const feed = await parser.parseURL(rssUrl);
    return (feed.items || [])
      .filter(item => item.link && item.title)
      .map(item => {
        const rawDate = item.isoDate || item.pubDate;
        const pubDate = rawDate ? new Date(rawDate).toISOString().slice(0, 10) : undefined;
        return {
          title: item.title!,
          link: item.link!,
          summary: item.contentSnippet || item.summary,
          pubDate,
        };
      });
  } catch (error) {
    console.warn(`⚠️  RSS 파싱 실패: ${rssUrl}`, error);
    return [];
  }
}
