import type { TranslateCategory } from '@jinho-blog/shared';

export interface TranslateSource {
  name: string;
  category: TranslateCategory;
  rssUrl: string;
}

export const TRANSLATE_SOURCES: TranslateSource[] = [
  // 프레임워크 / 라이브러리
  { name: 'React Blog', category: 'react', rssUrl: 'https://react.dev/feed.xml' },
  { name: 'Next.js Blog', category: 'nextjs', rssUrl: 'https://nextjs.org/feed.xml' },
  { name: 'TanStack Blog', category: 'tanstack', rssUrl: 'https://tanstack.com/rss.xml' },
  // 배포 / 플랫폼
  { name: 'Vercel Blog', category: 'vercel', rssUrl: 'https://vercel.com/atom' },
  // 언어 / 스타일링
  { name: 'TypeScript Blog', category: 'typescript', rssUrl: 'https://devblogs.microsoft.com/typescript/feed/' },
  { name: 'Tailwind CSS Blog', category: 'tailwindcss', rssUrl: 'https://tailwindcss.com/feeds/feed.xml' },
  // 웹 플랫폼
  { name: 'Chrome Developers', category: 'chrome', rssUrl: 'https://developer.chrome.com/static/blog/feed.xml' },
  { name: 'web.dev', category: 'webdev', rssUrl: 'https://web.dev/feed.xml' },
  { name: 'V8 Blog', category: 'v8', rssUrl: 'https://v8.dev/blog.atom' },
  // AI
  {
    name: 'Anthropic Engineering',
    category: 'claude',
    rssUrl: 'https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_engineering.xml',
  },
  {
    name: 'Claude Blog',
    category: 'claude',
    rssUrl: 'https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_claude.xml',
  },
  { name: 'OpenAI Developers', category: 'openai', rssUrl: 'https://developers.openai.com/rss.xml' },
];
