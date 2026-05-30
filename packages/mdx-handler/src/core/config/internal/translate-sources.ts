import type { TranslateCategory } from '@jinho-blog/shared';

export type SourceLicense = 'cc-by-4.0' | 'cc-by-3.0' | 'all-rights-reserved';

export interface TranslateSource {
  name: string;
  category: TranslateCategory;
  rssUrl: string;
  license: SourceLicense;
  licenseUrl?: string;
}

const CC_BY_4 = 'https://creativecommons.org/licenses/by/4.0/';
const CC_BY_3 = 'https://creativecommons.org/licenses/by/3.0/';

export const TRANSLATE_SOURCES: TranslateSource[] = [
  // 프레임워크 / 라이브러리 — CC BY 4.0
  {
    name: 'React Blog',
    category: 'react',
    rssUrl: 'https://react.dev/feed.xml',
    license: 'cc-by-4.0',
    licenseUrl: CC_BY_4,
  },
  // 프레임워크 / 라이브러리 — All rights reserved
  { name: 'Next.js Blog', category: 'nextjs', rssUrl: 'https://nextjs.org/feed.xml', license: 'all-rights-reserved' },
  // 언어 / 스타일링 — All rights reserved
  {
    name: 'TypeScript Blog',
    category: 'typescript',
    rssUrl: 'https://devblogs.microsoft.com/typescript/feed/',
    license: 'all-rights-reserved',
  },
  {
    name: 'Tailwind CSS Blog',
    category: 'tailwindcss',
    rssUrl: 'https://tailwindcss.com/feeds/feed.xml',
    license: 'all-rights-reserved',
  },
  // 웹 플랫폼 — CC BY 4.0 / CC BY 3.0
  {
    name: 'Chrome Developers',
    category: 'chrome',
    rssUrl: 'https://developer.chrome.com/static/blog/feed.xml',
    license: 'cc-by-4.0',
    licenseUrl: CC_BY_4,
  },
  {
    name: 'web.dev',
    category: 'webdev',
    rssUrl: 'https://web.dev/feed.xml',
    license: 'cc-by-4.0',
    licenseUrl: CC_BY_4,
  },
  { name: 'V8 Blog', category: 'v8', rssUrl: 'https://v8.dev/blog.atom', license: 'cc-by-3.0', licenseUrl: CC_BY_3 },
  // AI — All rights reserved
  {
    name: 'Anthropic Engineering',
    category: 'claude',
    rssUrl: 'https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_engineering.xml',
    license: 'all-rights-reserved',
  },
  {
    name: 'Claude Blog',
    category: 'claude',
    rssUrl: 'https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_claude.xml',
    license: 'all-rights-reserved',
  },
  {
    name: 'OpenAI Developers',
    category: 'openai',
    rssUrl: 'https://developers.openai.com/rss.xml',
    license: 'all-rights-reserved',
  },
];
