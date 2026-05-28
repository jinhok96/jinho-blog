import type { TranslateCategory } from '@jinho-blog/shared';

export interface TranslateSource {
  name: string;
  category: TranslateCategory;
  rssUrl: string;
}

export const TRANSLATE_SOURCES: TranslateSource[] = [
  { name: 'React Blog', category: 'react', rssUrl: 'https://react.dev/feed.xml' },
  { name: 'Next.js Blog', category: 'nextjs', rssUrl: 'https://nextjs.org/feed.xml' },
  { name: 'Vercel Blog', category: 'vercel', rssUrl: 'https://vercel.com/atom' },
];
